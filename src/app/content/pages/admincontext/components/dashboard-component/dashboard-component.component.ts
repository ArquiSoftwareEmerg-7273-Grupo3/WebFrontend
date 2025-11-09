import {Component, OnInit} from '@angular/core';
import {SidebarComponentComponent} from '../../public/components/sidebar-component/sidebar-component.component';
import {User} from '../../interfaces/user/user';
import {AdminServiceService} from '../../services/admin-service.service';
import {RouterLink} from '@angular/router';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatLine} from '@angular/material/core';

@Component({
  selector: 'app-dashboard-component',
  imports: [
    RouterLink,
    NgIf,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    SidebarComponentComponent,
    MatNavList,
    MatListItem,
    MatLine,
    MatIconButton
  ],
  templateUrl: './dashboard-component.component.html',
  styleUrl: './dashboard-component.component.css'
})
export class DashboardComponentComponent implements OnInit {
  users: User[] = [];

  loading = false;
  error = '';
  constructor(private svc: AdminServiceService) {}

  ngOnInit() {
    this.load();
  }

  private handleError(msg: string) {
    this.error = msg;
    this.loading = false;
  }

  load() {
    this.loading = true;
    this.error = '';
    this.svc.getUsers().subscribe({
      next: d => {
        this.users = d;
        this.loading = false;
      },
      error: () => this.handleError('Error cargando usuarios')
    });
  }

  changeStatus(u: User, newStatus: string) {
    if (!u || newStatus === u.status) return;

    const msg = newStatus === 'suspended'
      ? `Suspender cuenta de ${u.name}?`
      : `Reactivar cuenta de ${u.name}?`;

    if (!confirm(msg)) return;

    this.loading = true;
    this.error = '';

    const obs = newStatus === 'suspended'
      ? this.svc.suspendUser(String(u.id))
      : this.svc.reactivateUser(String(u.id));

    obs.subscribe({
      next: () => {
        this.load();
      },
      error: () => {
        this.loading = false;
        alert('Error actualizando estado');
      }
    });
  }

  openPortfolio(url?: string) {
    if (!url) return;
    try {
      window.open(url, '_blank');
    } catch (e) {
      console.error('No se pudo abrir el portfolio', e);
    }
  }

  confirmDelete(user: User): void {
    const confirmed = window.confirm(`¿Eliminar usuario "${user.name}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;
    this.deleteUser(user);
  }

  deleteUser(user: User): void {
    if (!user?.id) {
      alert('Usuario inválido');
      return;
    }
    this.loading = true;
    this.svc.deleteUser(String(user.id)).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error eliminando usuario', err);
        this.loading = false;
        alert('Error eliminando usuario');
      }
    });
  }
}
