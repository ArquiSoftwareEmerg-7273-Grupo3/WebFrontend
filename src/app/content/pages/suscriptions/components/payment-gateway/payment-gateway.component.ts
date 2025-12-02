import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MercadopagoService } from '../../services/mercadopago.service';
import { AuthenticationService } from '../../../login/services/authentication.service';
import { UserInfoResponse } from '../../../login/model/user-info.response';

@Component({
  selector: 'app-payment-gateway',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css'
})
export class PaymentGatewayComponent implements OnInit {
  // Datos del formulario
  email: string = '';

  // Estado
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Plan info
  planAmount: number = 10.00;  // Monto de prueba recomendado para suscripciones

  // Información del usuario
  private currentUser: UserInfoResponse | null = null;

  constructor(
    private mercadopagoService: MercadopagoService,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    // Cargar información del usuario al inicializar el componente
    this.authService.ensureUserInformation().then(userInfo => {
      if (userInfo) {
        this.currentUser = userInfo;
        // Pre-llenar el email si está disponible
        if (userInfo.username) {
          this.email = userInfo.username;
        }
        
        const userType = this.getUserType(userInfo);
        
        console.log('✅ Usuario cargado:', {
          id: userInfo.id,
          username: userInfo.username,
          userType: userType,
          ilustrador: userInfo.ilustrador,
          escritor: userInfo.escritor,
          roleName: userInfo.roleName
        });
        
        // Validar que el usuario tenga un perfil específico
        if (userType === 'UNKNOWN') {
          console.warn('⚠️ Usuario sin perfil de ILUSTRADOR o ESCRITOR');
          console.warn('El usuario debe tener un perfil específico para suscribirse');
        }
      } else {
        console.warn('⚠️ No se pudo cargar la información del usuario');
      }
    });
  }

  /**
   * Determinar el tipo de usuario (ILUSTRADOR o ESCRITOR)
   */
  private getUserType(userInfo: UserInfoResponse): string {
    if (userInfo.ilustrador && userInfo.ilustrador !== null) {
      return 'ILUSTRADOR';
    } else if (userInfo.escritor && userInfo.escritor !== null) {
      return 'ESCRITOR';
    }
    return 'UNKNOWN';
  }

  /**
   * Redirigir al checkout de Mercado Pago (Pago Único Mensual)
   * Más confiable que suscripciones automáticas
   */
  redirectToCheckout(): void {
    if (!this.email) {
      this.errorMessage = 'Por favor ingresa tu correo electrónico';
      return;
    }

    // Verificar que el usuario esté autenticado
    if (!this.currentUser) {
      this.errorMessage = 'Debes iniciar sesión para continuar con la suscripción';
      console.error('❌ Usuario no autenticado');
      return;
    }

    const userId = this.currentUser.id.toString();
    const userType = this.getUserType(this.currentUser);

    // Validar que el usuario tenga un perfil específico
    if (userType === 'UNKNOWN') {
      this.errorMessage = 'Tu cuenta debe tener un perfil de Ilustrador o Escritor para suscribirse. Por favor completa tu perfil primero.';
      console.error('❌ Usuario sin perfil específico');
      console.error('Datos del usuario:', {
        id: this.currentUser.id,
        ilustrador: this.currentUser.ilustrador,
        escritor: this.currentUser.escritor,
        roleName: this.currentUser.roleName
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    console.log('=== Creando preferencia de pago ===');
    console.log('User ID:', userId);
    console.log('User Type:', userType);
    console.log('Email:', this.email);
    console.log('Ilustrador data:', this.currentUser.ilustrador);
    console.log('Escritor data:', this.currentUser.escritor);

    // Crear preferencia de pago único
    const preferenceRequest: any = {
      title: 'Suscripción Premium Mensual - ArtCollab',
      description: 'Pago mensual del plan premium',
      price: this.planAmount,
      quantity: 1,
      email: this.email,
      firstName: 'Test',  // Nombre de prueba
      lastName: 'User',   // Apellido de prueba
      userId: userId,
      userType: userType
    };

    console.log('Creando preferencia de pago con:', preferenceRequest);

    this.mercadopagoService.createPreference(preferenceRequest).subscribe({
      next: (response) => {
        console.log('✅ Preferencia creada exitosamente:', response);
        this.loading = false;

        // Guardar el preference ID y datos del usuario
        localStorage.setItem('preferenceId', response.preferenceId);
        localStorage.setItem('userEmail', this.email);
        localStorage.setItem('pendingSubscriptionUserId', userId);
        localStorage.setItem('pendingSubscriptionUserType', userType);

        // Redirigir al checkout de Mercado Pago
        window.location.href = response.initPoint;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error al crear la preferencia de pago. Verifica tu conexión.';
        console.error('❌ Error completo:', error);
      }
    });
  }
}
