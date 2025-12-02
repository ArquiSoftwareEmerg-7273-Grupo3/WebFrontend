import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { SubscriptionStatusService } from '../services/subscription-status.service';

/**
 * Guard para proteger rutas que requieren suscripción premium
 * Solo permite acceso a usuarios con suscripción activa
 */
export const premiumGuard: CanActivateFn = (route, state) => {
  const subscriptionService = inject(SubscriptionStatusService);
  const router = inject(Router);

  return subscriptionService.checkCurrentUserSubscription().pipe(
    map(isPremium => {
      if (isPremium) {
        return true;
      } else {
        // Redirigir a la página de planes si no es premium
        router.navigate(['/settings/plans']);
        return false;
      }
    })
  );
};
