import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SubscriptionStatusService } from '../../../../shared/services/subscription-status.service';

@Component({
  selector: 'app-subscription-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-container">
      <div class="success-card">
        <div class="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h1>¡Pago Exitoso!</h1>
        <p class="subtitle">Tu suscripción premium está siendo activada</p>
        
        <div class="info-box" *ngIf="!subscriptionActivated">
          <div class="spinner"></div>
          <p>Estamos procesando tu pago...</p>
          <p class="small">Esto puede tomar unos segundos</p>
        </div>
        
        <div class="info-box success" *ngIf="subscriptionActivated">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          <p><strong>¡Suscripción Activada!</strong></p>
          <p class="small">Ya puedes disfrutar de todos los beneficios premium</p>
        </div>
        
        <div class="benefits">
          <h3>Beneficios Premium:</h3>
          <ul>
            <li>✨ Badge premium en tu perfil</li>
            <li>🎨 Acceso a herramientas avanzadas</li>
            <li>📊 Estadísticas detalladas</li>
            <li>🚀 Prioridad en el soporte</li>
            <li>💎 Contenido exclusivo</li>
          </ul>
        </div>
        
        <div class="actions">
          <button class="btn-primary" (click)="goToProfile()">
            Ir a Mi Perfil
          </button>
          <button class="btn-secondary" (click)="goToHome()">
            Volver al Inicio
          </button>
        </div>
        
        <div class="payment-details" *ngIf="paymentId">
          <p class="small">ID de Pago: {{ paymentId }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .success-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
    }

    .success-icon {
      color: #10b981;
      margin-bottom: 20px;
      animation: scaleIn 0.5s ease-out;
    }

    @keyframes scaleIn {
      from {
        transform: scale(0);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    h1 {
      font-size: 32px;
      color: #1f2937;
      margin-bottom: 10px;
    }

    .subtitle {
      font-size: 18px;
      color: #6b7280;
      margin-bottom: 30px;
    }

    .info-box {
      background: #f3f4f6;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }

    .info-box.success {
      background: #d1fae5;
      color: #065f46;
    }

    .spinner {
      border: 3px solid #f3f4f6;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 10px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .benefits {
      text-align: left;
      margin: 30px 0;
      padding: 20px;
      background: #f9fafb;
      border-radius: 12px;
    }

    .benefits h3 {
      color: #1f2937;
      margin-bottom: 15px;
    }

    .benefits ul {
      list-style: none;
      padding: 0;
    }

    .benefits li {
      padding: 8px 0;
      color: #4b5563;
      font-size: 16px;
    }

    .actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      flex: 1;
      min-width: 150px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-secondary:hover {
      background: #f3f4f6;
    }

    .payment-details {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }

    .small {
      font-size: 14px;
      color: #9ca3af;
    }
  `]
})
export class SubscriptionSuccessComponent implements OnInit {
  paymentId: string | null = null;
  subscriptionActivated: boolean = false;
  checkAttempts: number = 0;
  maxAttempts: number = 10;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionStatusService
  ) {}

  ngOnInit(): void {
    // Obtener parámetros de la URL que Mercado Pago envía
    this.route.queryParams.subscribe(params => {
      this.paymentId = params['payment_id'] || params['collection_id'];
      const preferenceId = params['preference_id'] || localStorage.getItem('preferenceId');
      
      console.log('=== Subscription Success Page ===');
      console.log('Payment ID:', this.paymentId);
      console.log('Preference ID:', preferenceId);
      console.log('All params:', params);
      
      // Activar suscripción manualmente si tenemos los datos necesarios
      if (this.paymentId && preferenceId) {
        console.log('Activating subscription...');
        this.activateSubscriptionManually(this.paymentId, preferenceId);
      } else {
        console.warn('Missing payment data. PaymentId:', this.paymentId, 'PreferenceId:', preferenceId);
      }
    });

    // Verificar el estado de la suscripción periódicamente
    this.checkSubscriptionStatus();
  }

  activateSubscriptionManually(paymentId: string, preferenceId: string): void {
    console.log('Calling activation endpoint...');
    
    // Llamar al endpoint de activación manual
    fetch(`http://localhost:8080/api/mercadopago/activate-subscription?paymentId=${paymentId}&preferenceId=${preferenceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Activation response status:', response.status);
      return response.text().then(text => ({
        status: response.status,
        ok: response.ok,
        body: text
      }));
    })
    .then(result => {
      console.log('Activation response:', result);
      if (result.ok) {
        console.log('✅ Suscripción activada exitosamente');
        this.subscriptionActivated = true;
        
        // Limpiar localStorage
        localStorage.removeItem('preferenceId');
        localStorage.removeItem('pendingSubscriptionUserId');
        localStorage.removeItem('pendingSubscriptionUserType');
      } else {
        console.error('❌ Error activando suscripción:', result.body);
      }
    })
    .catch(error => {
      console.error('❌ Error en la activación manual:', error);
    });
  }

  checkSubscriptionStatus(): void {
    const interval = setInterval(() => {
      this.checkAttempts++;
      
      this.subscriptionService.checkCurrentUserSubscription().subscribe(
        isPremium => {
          if (isPremium) {
            this.subscriptionActivated = true;
            clearInterval(interval);
          } else if (this.checkAttempts >= this.maxAttempts) {
            clearInterval(interval);
            console.log('Max attempts reached. Subscription may take a few more minutes to activate.');
          }
        }
      );
    }, 3000); // Verificar cada 3 segundos
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
