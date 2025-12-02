import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-failure',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="failure-container">
      <div class="failure-card">
        <div class="failure-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        
        <h1>Pago No Completado</h1>
        <p class="subtitle">No se pudo procesar tu pago</p>
        
        <div class="info-box">
          <p>El pago no fue aprobado. Esto puede deberse a:</p>
          <ul>
            <li>Fondos insuficientes</li>
            <li>Datos de tarjeta incorrectos</li>
            <li>Límite de compra excedido</li>
            <li>Cancelación del pago</li>
          </ul>
        </div>
        
        <div class="actions">
          <button class="btn-primary" (click)="retryPayment()">
            Intentar Nuevamente
          </button>
          <button class="btn-secondary" (click)="goToHome()">
            Volver al Inicio
          </button>
        </div>
        
        <div class="help">
          <p class="small">¿Necesitas ayuda? <a href="/support">Contacta con soporte</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .failure-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      padding: 20px;
    }

    .failure-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
    }

    .failure-icon {
      color: #ef4444;
      margin-bottom: 20px;
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
      background: #fef2f2;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
      text-align: left;
    }

    .info-box ul {
      margin-top: 15px;
      padding-left: 20px;
    }

    .info-box li {
      padding: 5px 0;
      color: #991b1b;
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

    .help {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }

    .small {
      font-size: 14px;
      color: #9ca3af;
    }

    a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    a:hover {
      text-decoration: underline;
    }
  `]
})
export class SubscriptionFailureComponent {
  constructor(private router: Router) {}

  retryPayment(): void {
    this.router.navigate(['/subscription/payment']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
