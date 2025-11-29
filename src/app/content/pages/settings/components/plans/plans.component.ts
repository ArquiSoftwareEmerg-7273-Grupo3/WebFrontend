import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MercadopagoService, SubscriptionResponse } from '../../../suscriptions/services/mercadopago.service';

@Component({
  selector: 'app-plans',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent implements OnInit {
  subscriptionId: string | null = null;
  subscription: SubscriptionResponse | null = null;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private mercadopagoService: MercadopagoService) { }

  ngOnInit(): void {
    this.subscriptionId = localStorage.getItem('subscriptionId');
    if (this.subscriptionId) {
      this.loadSubscription();
    }
  }

  loadSubscription(): void {
    if (!this.subscriptionId) return;

    this.loading = true;
    this.mercadopagoService.getSubscription(this.subscriptionId).subscribe({
      next: (response) => {
        this.subscription = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar la suscripción';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  cancelSubscription(): void {
    if (!this.subscriptionId) return;

    if (!confirm('¿Estás seguro de que deseas cancelar tu suscripción?')) {
      return;
    }

    this.loading = true;
    this.mercadopagoService.cancelSubscription(this.subscriptionId).subscribe({
      next: (response) => {
        this.subscription = response;
        this.successMessage = 'Suscripción cancelada exitosamente';
        this.loading = false;

        // Limpiar después de 3 segundos
        setTimeout(() => {
          localStorage.removeItem('subscriptionId');
          this.subscriptionId = null;
          this.subscription = null;
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'Error al cancelar la suscripción';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  pauseSubscription(): void {
    if (!this.subscriptionId) return;

    if (!confirm('¿Deseas pausar tu suscripción?')) {
      return;
    }

    this.loading = true;
    this.mercadopagoService.pauseSubscription(this.subscriptionId).subscribe({
      next: (response) => {
        this.subscription = response;
        this.successMessage = 'Suscripción pausada exitosamente';
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al pausar la suscripción';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  get hasPremium(): boolean {
    return this.subscription !== null &&
      this.subscription.status === 'authorized';
  }
}
