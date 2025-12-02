# Premium Badge Component

Componente reutilizable para mostrar un badge premium junto al nombre de usuarios con suscripción activa.

## Uso Básico

### 1. Importar el componente

```typescript
import { PremiumBadgeComponent } from '@shared/components/premium-badge/premium-badge.component';

@Component({
  // ...
  imports: [PremiumBadgeComponent]
})
```

### 2. Usar en el template

```html
<!-- Badge normal -->
<span class="user-name">Juan Pérez</span>
<app-premium-badge [isPremium]="true"></app-premium-badge>

<!-- Badge pequeño -->
<app-premium-badge [isPremium]="user.hasSubscription" size="small"></app-premium-badge>

<!-- Solo icono -->
<app-premium-badge [isPremium]="true" [iconOnly]="true"></app-premium-badge>
```

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `isPremium` | boolean | false | Si el usuario tiene suscripción activa |
| `size` | 'normal' \| 'small' | 'normal' | Tamaño del badge |
| `iconOnly` | boolean | false | Mostrar solo el icono sin texto |
| `tooltipText` | string | 'Usuario Premium...' | Texto del tooltip |

## Ejemplo Completo

```typescript
// En tu componente
export class UserProfileComponent {
  userId: number = 123;
  userName: string = 'María García';
  isPremium: boolean = false;

  constructor(private subscriptionService: SubscriptionStatusService) {}

  ngOnInit() {
    // Verificar estado de suscripción
    this.subscriptionService.checkSubscriptionStatus(this.userId).subscribe(
      isPremium => this.isPremium = isPremium
    );
  }
}
```

```html
<!-- En tu template -->
<div class="user-header">
  <h2>{{ userName }}</h2>
  <app-premium-badge [isPremium]="isPremium"></app-premium-badge>
</div>
```

## Componente Helper: UserDisplayComponent

Para casos comunes, puedes usar el componente helper que incluye el badge automáticamente:

```html
<app-user-display
  [userId]="123"
  [userName]="'Juan Pérez'"
  [userEmail]="'juan@example.com'"
  [showEmail]="true"
  badgeSize="normal">
</app-user-display>
```

Este componente:
- Verifica automáticamente el estado de suscripción
- Muestra el nombre del usuario
- Agrega el badge premium si corresponde
- Opcionalmente muestra el email

## Estilos

El badge tiene:
- Gradiente morado/azul
- Animación sutil de "sparkle"
- Efecto hover
- Sombra con color del gradiente
- Responsive y accesible

## Verificar Suscripción

```typescript
import { SubscriptionStatusService } from '@shared/services/subscription-status.service';

constructor(private subscriptionService: SubscriptionStatusService) {}

// Verificar usuario específico
this.subscriptionService.checkSubscriptionStatus(userId).subscribe(
  isPremium => console.log('Is premium:', isPremium)
);

// Verificar usuario actual
this.subscriptionService.checkCurrentUserSubscription().subscribe(
  isPremium => console.log('Current user is premium:', isPremium)
);

// Obtener detalles completos
this.subscriptionService.getSubscriptionDetails(userId).subscribe(
  details => console.log('Subscription details:', details)
);
```

## Seguridad

El sistema valida que:
1. El email del pago coincida con el email registrado del usuario
2. Solo usuarios autenticados puedan ver su estado de suscripción
3. Los pagos sean procesados por MercadoPago antes de activar

Si alguien intenta pagar con un email diferente, la suscripción NO se activará y se registrará un log de seguridad.
