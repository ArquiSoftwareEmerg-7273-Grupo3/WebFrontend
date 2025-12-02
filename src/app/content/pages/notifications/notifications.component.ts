import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService, Notification } from './services/notification.service';
import { AuthenticationService } from '../login/services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  selectedFilter: 'all' | 'unread' = 'all';
  loading = false;
  currentUserId: number = 0;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios en notificaciones
    const notificationsSub = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
        this.applyFilter();
      }
    );
    this.subscriptions.push(notificationsSub);
    
    // Obtener el userId del servicio de autenticación (igual que el toolbar)
    this.authService.getUserInformation()
      .then(userInfo => {
        if (userInfo && userInfo.id) {
          this.currentUserId = userInfo.id;
          
          // Cargar notificaciones con el ID correcto
          this.loadNotifications();
          
          // Iniciar polling
          this.notificationService.startPolling(this.currentUserId, 60000);
        } else {
          console.error('No user info available from auth service');
        }
      })
      .catch(error => {
        console.error('Error getting user info:', error);
      });
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // NO detener el polling aquí porque otros componentes pueden necesitarlo
    // El polling se maneja globalmente en el servicio
  }

  loadNotifications(): void {
    this.loading = true;
    
    this.notificationService.getNotifications(this.currentUserId).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loading = false;
        // Mostrar mensaje de error al usuario
      }
    });
  }

  applyFilter(): void {
    if (this.selectedFilter === 'all') {
      this.filteredNotifications = this.notifications;
    } else if (this.selectedFilter === 'unread') {
      this.filteredNotifications = this.notifications.filter(n => !n.read);
    }
  }

  setFilter(filter: 'all' | 'unread'): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  markAsRead(notification: Notification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id, this.currentUserId).subscribe({
        next: () => {
          notification.read = true;
          this.applyFilter();
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead(this.currentUserId).subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error marking all as read:', error);
      }
    });
  }

  deleteNotification(notification: Notification, event: Event): void {
    event.stopPropagation();
    
    this.notificationService.deleteNotification(notification.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error deleting notification:', error);
      }
    });
  }

  handleNotificationClick(notification: Notification): void {
    this.markAsRead(notification);
    if (notification.actionUrl) {
      this.router.navigate([notification.actionUrl]);
    }
  }

  getNotificationIcon(type: string): string {
    return this.notificationService.getIconClass(type);
  }

  getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Hace un momento';
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} minutos`;
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} horas`;
    if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)} días`;
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}
