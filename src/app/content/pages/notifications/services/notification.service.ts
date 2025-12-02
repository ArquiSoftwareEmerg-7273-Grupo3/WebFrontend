import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

/**
 * Interface para las notificaciones del backend
 */
export interface NotificationResponse {
  id: number;
  recipientUserId: number;
  actorUserId: number;
  type: string;
  title: string;
  message: string;
  priority: string;
  isRead: boolean;
  readAt: string | null;
  relatedEntityId: number | null;
  relatedEntityType: string | null;
  actionUrl: string | null;
  createdAt: string;
  expiresAt: string | null;
  active: boolean;
}

/**
 * Interface para el componente (compatible con el existente)
 */
export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actorUserId?: number;
  relatedEntityId?: number;
  relatedEntityType?: string;
  priority?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private basePath = 'http://localhost:8088/api/v1/notifications';
  
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private pollingInterval: any = null;
  private isPolling = false;

  constructor(private http: HttpClient) {}

  
  getNotifications(userId: number): Observable<Notification[]> {
    const params = new HttpParams().set('userId', userId.toString());
    const url = `${this.basePath}?userId=${userId}`;
    
    
    return this.http.get<NotificationResponse[]>(this.basePath, { 
      params,
      headers: this.httpOptions.headers 
    }).pipe(
      map(responses => {
        return responses.map(r => this.mapToNotification(r));
      }),
      tap(notifications => {
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
      })
    );
  }

  /**
   * Obtiene solo las notificaciones no leídas
   */
  getUnreadNotifications(userId: number): Observable<Notification[]> {
    const params = new HttpParams().set('userId', userId.toString());
    
    return this.http.get<NotificationResponse[]>(`${this.basePath}/unread`, { 
      params,
      headers: this.httpOptions.headers 
    }).pipe(
      map(responses => responses.map(r => this.mapToNotification(r))),
      tap(notifications => this.updateUnreadCount(notifications))
    );
  }

  /**
   * Obtiene una notificación específica por ID
   */
  getNotificationById(notificationId: number): Observable<Notification> {
    return this.http.get<NotificationResponse>(`${this.basePath}/${notificationId}`, this.httpOptions)
      .pipe(map(r => this.mapToNotification(r)));
  }


  markAsRead(notificationId: number, userId: number): Observable<Notification> {
    return this.http.patch<NotificationResponse>(
      `${this.basePath}/${notificationId}/read`,
      { userId },
      this.httpOptions
    ).pipe(
      map(r => this.mapToNotification(r)),
      tap(() => {
        // Actualizar el estado local
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        );
        this.notificationsSubject.next(updatedNotifications);
        this.updateUnreadCount(updatedNotifications);
      })
    );
  }


  markAllAsRead(userId: number): Observable<any> {
    const unreadNotifications = this.notificationsSubject.value.filter(n => !n.read);
    
    unreadNotifications.forEach(notification => {
      this.markAsRead(notification.id, userId).subscribe();
    });
    
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

 
  deleteNotification(notificationId: number): Observable<any> {
    // TODO: Implementar cuando el endpoint esté disponible
    // return this.http.delete(`${this.basePath}/${notificationId}`, this.httpOptions);
    
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== notificationId);
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
    
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

 
  getUnreadCount(userId: number): Observable<number> {
    return this.getUnreadNotifications(userId).pipe(
      map(notifications => notifications.length)
    );
  }

  
  startPolling(userId: number, intervalMs: number = 30000): void {
    // Si ya hay polling activo, no crear otro
    if (this.isPolling) {
      return;
    }

    this.isPolling = true;
    
    this.pollingInterval = setInterval(() => {
      this.getNotifications(userId).subscribe({
        error: (err) => console.error('Error polling notifications:', err)
      });
    }, intervalMs);
  }

  /**
   * Detiene el polling de notificaciones
   */
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      this.isPolling = false;
    }
  }

  /**
   * Mapea la respuesta del backend al formato del componente
   */
  private mapToNotification(response: NotificationResponse): Notification {
    return {
      id: response.id,
      type: this.mapNotificationType(response.type),
      title: response.title,
      message: response.message,
      timestamp: new Date(response.createdAt),
      read: response.isRead,
      actionUrl: response.actionUrl || undefined,
      actorUserId: response.actorUserId,
      relatedEntityId: response.relatedEntityId || undefined,
      relatedEntityType: response.relatedEntityType || undefined,
      priority: response.priority
    };
  }

  /**
   * Mapea los tipos de notificación del backend a los del frontend
   */
  private mapNotificationType(backendType: string): string {
    const typeMap: { [key: string]: string } = {
      'NEW_COMMENT': 'comment',
      'NEW_LIKE': 'like',
      'NEW_SHARE': 'share',
      'NEW_FOLLOWER': 'follower',
      'PROJECT_APPLICATION': 'application',
      'APPLICATION_ACCEPTED': 'success',
      'APPLICATION_REJECTED': 'warning',
      'COLLABORATION_INVITE': 'invite',
      'COLLABORATION_ACCEPTED': 'success',
      'COLLABORATION_REJECTED': 'warning',
      'SUBSCRIPTION_ACTIVATED': 'subscription',
      'SUBSCRIPTION_EXPIRED': 'warning',
      'PAYMENT_SUCCESSFUL': 'success',
      'PAYMENT_FAILED': 'error',
      'SYSTEM_ANNOUNCEMENT': 'announcement'
    };
    
    return typeMap[backendType] || 'info';
  }

  /**
   * Actualiza el contador de notificaciones no leídas
   */
  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  /**
   * Obtiene el icono apropiado para cada tipo de notificación
   */
  getIconClass(type: string): string {
    const icons: { [key: string]: string } = {
      'comment': 'fas fa-comment',
      'like': 'fas fa-heart',
      'share': 'fas fa-share',
      'follower': 'fas fa-user-plus',
      'application': 'fas fa-briefcase',
      'success': 'fas fa-check-circle',
      'warning': 'fas fa-exclamation-triangle',
      'error': 'fas fa-times-circle',
      'invite': 'fas fa-envelope',
      'subscription': 'fas fa-star',
      'announcement': 'fas fa-bullhorn',
      'info': 'fas fa-info-circle'
    };
    
    return icons[type] || 'fas fa-bell';
  }
}
