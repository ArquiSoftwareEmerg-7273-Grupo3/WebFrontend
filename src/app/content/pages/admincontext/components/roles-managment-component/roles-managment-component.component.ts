import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {User} from '../../interfaces/user/user';
import {AdminServiceService} from '../../services/admin-service.service';
import {SidebarComponentComponent} from '../../public/components/sidebar-component/sidebar-component.component';
import {NgForOf, NgIf} from '@angular/common';
import {Validators} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-roles-managment-component',
  imports: [
    ReactiveFormsModule,
    SidebarComponentComponent,
    NgForOf,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './roles-managment-component.component.html',
  styleUrl: './roles-managment-component.component.css'
})
export class RolesManagmentComponentComponent implements OnInit {
  form: FormGroup;
  users: User[] = [];
  loading = false;
  saving = false;
  error = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private svc: AdminServiceService) {
    this.form = this.fb.group({
      userId: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading = true;
    this.error = '';
    this.svc.getUsers().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (list: User[] | null) => this.users = list ?? [],
      error: (err) => {
        console.error(err);
        this.users = [];
        this.error = 'No se pudieron cargar los usuarios';
      }
    });
  }

  changeRole(): void {
    console.log('changeRole called', { saving: this.saving, valid: this.form.valid, value: this.form.value });
    this.successMessage = '';
    this.error = '';
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      console.log('form invalid', this.form.errors);
      return;
    }

    const { userId, role } = this.form.value;
    if (!userId) {
      this.error = 'Seleccione un usuario';
      console.log('no userId selected');
      return;
    }

    this.saving = true;
    this.svc.updateUserRole(userId, role).pipe(
      finalize(() => {
        this.saving = false;
        console.log('save finalize, saving set to', this.saving);
      })
    ).subscribe({
      next: () => {
        console.log('updateUserRole success');
        this.successMessage = 'Rol actualizado correctamente';
        this.loadUsers();
        this.form.reset();
      },
      error: (err) => {
        console.error('updateUserRole error', err);
        this.error = 'No se pudo actualizar el rol';
      }
    });
  }
}
