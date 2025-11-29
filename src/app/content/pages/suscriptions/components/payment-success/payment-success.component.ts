import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSubscriptionService } from '../../services/user-subscription.service';

@Component({
  selector: 'app-payment-success',
  imports: [CommonModule],
  template: `
    <div class="success-page">
      <div class="success-container">
        <div class="success-icon">✓</div>
        <h1>¡Pago Confirmado!</h1>
        <p>Tu suscripción Premium ha sido activada exitosamente.</p>
        
        <div class="success-details" *ngIf="!loading">
          <p><strong>Plan:</strong> Premium Mensual</p>
          <p><strong>Monto:</strong> S/. 1.00/mes</p>
          <p><strong>Estado:</strong> Activo</p>
        </div>
        
        <div *ngIf="loading" class="loading">
          Activando tu suscripción...
        </div>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <button class="btn-primary" (click)="goToPlans()">
          Ver Mi Suscripción
        </button>
      </div>
    </div>
  `,
  styles: [`
    .success-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
      padding: 20px;
    }
    
    .success-container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    
    .success-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #35c8b4 0%, #a4cf4a 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      color: white;
      margin: 0 auto 20px;
    }
    
    h1 {
      color: #213531;
      margin-bottom: 10px;
    }
    
    .success-details {
      background: #f5f9f8;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
      text-align: left;
    }
    
    .success-details p {
      margin: 8px 0;
      color: #4b5a63;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #35c8b4 0%, #2da595 55%, #a4cf4a 100%);
      color: white;
      border: none;
      border-radius: 999px;
      padding: 12px 32px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 20px;
    }
    
    .loading {
      padding: 20px;
      color: #7a8a90;
    }
    
    .error-message {
      color: #dc3545;
      padding: 12px;
      background: #f8d7da;
      border-radius: 8px;
      margin: 16px 0;
    }
  `]
})
export class PaymentSuccessComponent implements OnInit {
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subscriptionService: UserSubscriptionService
  ) { }

  ngOnInit(): void {
    // Obtener parámetros de la URL (Mercado Pago los envía)
    this.route.queryParams.subscribe(params => {
      const paymentId = params['payment_id'] || params['collection_id'];
      const preferenceId = params['preference_id'] || localStorage.getItem('preferenceId');
      const status = params['status'];

      console.log('Parámetros recibidos:', params);

      if (status === 'approved' && paymentId) {
        this.activateUserSubscription(paymentId, preferenceId || 'preference_' + Date.now());
      } else if (status === 'pending') {
        this.loading = false;
        this.errorMessage = 'Tu pago está pendiente de confirmación. Te notificaremos cuando se complete.';
      } else {
        this.loading = false;
        this.errorMessage = 'No se pudo confirmar el pago. Por favor contacta a soporte.';
      }
    });
  }

  activateUserSubscription(paymentId: string, preferenceId: string): void {
    // Obtener datos del usuario del localStorage o servicio de autenticación
    const userId = localStorage.getItem('userId') || '1';
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const userType = localStorage.getItem('userType') || 'ILUSTRADOR';  // o 'ESCRITOR'

    const request = {
      userId: userId,
      userEmail: userEmail,
      userType: userType as 'ILUSTRADOR' | 'ESCRITOR',
      mercadoPagoSubscriptionId: paymentId,
      mercadoPagoPlanId: preferenceId
    };

    console.log('Activando suscripción con:', request);

    this.subscriptionService.activateSubscription(request).subscribe({
      next: (response) => {
        console.log('Suscripción activada:', response);
        localStorage.setItem('hasActiveSubscription', 'true');
        localStorage.setItem('paymentId', paymentId);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al activar suscripción:', error);
        this.errorMessage = 'Hubo un error al activar tu suscripción. Por favor contacta a soporte.';
        this.loading = false;
      }
    });
  }

  goToPlans(): void {
    this.router.navigate(['/settings/plans']);
  }
}
