import { Injectable } from '@angular/core';
import {BehaviorSubject, firstValueFrom, Subscription, take} from 'rxjs';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../login/services/authentication.service';

export interface MiniTutorialStep {
  selector: string;
  title: string;
  description?: string;
  padding?: number;
  router?: string | string[];
  requiresAuth?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MiniTutorialService {

  private _isOpen$ = new BehaviorSubject<boolean>(false);
  private _steps$ = new BehaviorSubject<MiniTutorialStep[] | null>(null);
  private _index$ = new BehaviorSubject<number>(0);

  isOpen$ = this._isOpen$.asObservable();
  steps$ = this._steps$.asObservable();
  index$ = this._index$.asObservable();

  private subs = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {
    this.subs.add(
      this._index$.subscribe(idx => {
        const steps = this._steps$.value;
        if (steps && steps[idx]) {
          this.handleStep(steps[idx]);
        }
      })
    );
    this.subs.add(
      this._steps$.subscribe(steps => {
        const idx = this._index$.value;
        if (steps && steps[idx]) {
          this.handleStep(steps[idx]);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  start(steps: MiniTutorialStep[], startIndex = 0) {
    console.debug('[mini-tutorial] start called, stepsLength=', steps?.length, 'startIndex=', startIndex);
    this._steps$.next(steps);
    this._index$.next(Math.max(0, Math.min(startIndex, steps.length - 1)));
    this._isOpen$.next(true);
  }

  stop() {
    console.debug('[mini-tutorial] stop called');
    this._isOpen$.next(false);
    this._steps$.next(null);
    this._index$.next(0);
  }

  next() {
    const steps = this._steps$.value;
    if (!steps) return;
    const next = Math.min(this._index$.value + 1, steps.length - 1);
    this._index$.next(next);
    if (next === steps.length - 1) { }
  }

  prev() {
    const prev = Math.max(this._index$.value - 1, 0);
    this._index$.next(prev);
  }

  private async handleStep(step: any) {
    if (!step) return;

    if (step.requiresAuth) {
      try {
        const signed = await firstValueFrom(this.authService.isSignedIn.pipe(take(1)));
        if (!signed) {
          console.log('[mini-tutorial] paso requiere autenticación y usuario NO autenticado -> saltando paso');
          return;
        }
      } catch (e) {
        console.warn('[mini-tutorial] fallo comprobando autenticación, saltando paso', e);
        return;
      }
    }

    if (step && step.router) {
      try {
        let ok = false;

        if (Array.isArray(step.router)) {
          ok = await this.router.navigate(step.router);
        } else if (typeof step.router === 'string') {
          const normalized = step.router.replace(/^\//, '');
          const segments = normalized.split('/').filter(Boolean);
          ok = await this.router.navigate(segments);
        } else {
          console.warn('Tipo de router no soportado:', typeof step.router);
        }

        await new Promise(resolve => setTimeout(resolve, 150));

        const currentUrl = this.router.url;
        if (!ok || currentUrl.includes('/login')) {
          console.warn('[mini-tutorial] navegación cancelada o redirigida a login -> salteando paso', { ok, currentUrl });
          return;
        }

        console.log('[mini-tutorial] navegación realizada con éxito ->', currentUrl);
      } catch (e) {
        console.error(' Error al navegar desde step.router', e);
        return;
      }
    }
  }
}
