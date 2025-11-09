import {Component, OnInit} from '@angular/core';
import {SidebarComponentComponent} from '../../public/components/sidebar-component/sidebar-component.component';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AdminServiceService} from '../../services/admin-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../interfaces/user/user';
import {NgIf} from '@angular/common';
import {MatCardContent, MatCardModule, MatCardTitle} from '@angular/material/card';
import {MatOption} from '@angular/material/core';
import {MatFormField, MatLabel, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
@Component({
  selector: 'app-user-form-component',
  imports: [
    SidebarComponentComponent,
    ReactiveFormsModule,
    NgIf,
    MatCardTitle,
    MatCardContent,
    MatCardModule,
    MatOption,
    MatSelect,
    MatFormField,
    MatLabel,
    MatButton,
    MatButtonToggleGroup,
    MatButtonToggle
  ],
  templateUrl: './user-form-component.component.html',
  styleUrl: './user-form-component.component.css'
})
export class UserFormComponentComponent implements OnInit {
  users: User[] = [];
  form;
  editingId?: number;
  saving = false;
  portfolio = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private svc: AdminServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      role: ['', Validators.required],
      status: ['active', Validators.required],
      portfolio: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId = Number(id);
      this.load(Number(id));
    }
  }

  private handleError(msg: string) {
    this.error = msg;
    this.saving = false;
  }

  load(id: number) {
    this.svc.getUser(id).subscribe({
      next: (d: User) => this.form.patchValue(d),
      error: () => this.handleError('No se pudo cargar los Usuarios')
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    const payload = this.form.value as User;
    const cb = {
      next: () => {
        this.saving = false;
        this.router.navigate(['admin/roles']);
      },
      error: () => this.handleError(this.editingId ? 'Error actualizando' : 'Error creando')
    };
    if (this.editingId) {
      this.svc.updateUser(this.editingId, payload).subscribe(cb);
    } else {
      this.svc.createUser(payload).subscribe(cb);
    }
  }


}
