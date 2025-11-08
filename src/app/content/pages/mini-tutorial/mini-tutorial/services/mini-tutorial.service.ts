import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface MiniTutorialStep {
  selector: string;
  title: string;
  description?: string;
  padding?: number;
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

  start(steps: MiniTutorialStep[], startIndex = 0) {
    this._steps$.next(steps);
    this._index$.next(Math.max(0, Math.min(startIndex, steps.length - 1)));
    this._isOpen$.next(true);
  }

  stop() {
    this._isOpen$.next(false);
    this._steps$.next(null);
    this._index$.next(0);
  }

  next() {
    const steps = this._steps$.value;
    if (!steps) return;
    const next = Math.min(this._index$.value + 1, steps.length - 1);
    this._index$.next(next);
    if (next === steps.length - 1) { /* opcional: no auto-close */ }
  }

  prev() {
    const prev = Math.max(this._index$.value - 1, 0);
    this._index$.next(prev);
  }
}
