import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MercadopagoService, PlanRequest } from '../../services/mercadopago.service';

@Component({
  selector: 'app-payment-gateway',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css'
})
export class PaymentGatewayComponent {
  // Datos del formulario
  email: string = '';

  // Estado
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Plan info
  planAmount: number = 10.00;  // Monto de prueba recomendado para suscripciones

  constructor(
    private mercadopagoService: MercadopagoService,
    private router: Router
  ) { }

  /**
   * Redirigir al checkout de Mercado Pago (Pago Único Mensual)
   * Más confiable que suscripciones automáticas
   */
  redirectToCheckout(): void {
    if (!this.email) {
      this.errorMessage = 'Por favor ingresa tu correo electrónico';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Crear preferencia de pago único
    const preferenceRequest = {
      title: 'Suscripción Premium Mensual - ArtCollab',
      description: 'Pago mensual del plan premium',
      price: this.planAmount,
      quantity: 1,
      email: this.email,
      firstName: 'Usuario',
      lastName: 'Premium'
    };

    console.log('Creando preferencia de pago con:', preferenceRequest);

    this.mercadopagoService.createPreference(preferenceRequest).subscribe({
      next: (response) => {
        console.log('Preferencia creada exitosamente:', response);
        this.loading = false;

        // Guardar el preference ID
        localStorage.setItem('preferenceId', response.preferenceId);
        localStorage.setItem('userEmail', this.email);

        // Redirigir al checkout de Mercado Pago
        window.location.href = response.initPoint;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error al crear la preferencia de pago. Verifica tu conexión.';
        console.error('Error completo:', error);
      }
    });
  }
}
