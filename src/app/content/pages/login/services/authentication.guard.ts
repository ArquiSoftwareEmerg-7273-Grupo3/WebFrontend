import {CanActivateFn, Router} from '@angular/router';
import {AuthenticationService} from "./authentication.service";
import {inject} from "@angular/core";
import {map, take} from "rxjs";

export const authenticationGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  return authenticationService.isSignedIn.pipe(
    take(1), map(isSignedIn => {
      if (isSignedIn) return true;
      router.navigate(['/sign-in']).then();
      window.alert('¡Redirigido! No puedes acceder sin iniciar sesión');
      return false;
    }));
};
