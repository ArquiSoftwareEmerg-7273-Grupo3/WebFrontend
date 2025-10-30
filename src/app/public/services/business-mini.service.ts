import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface BusinessMiniState {
  open: boolean;
  x?: number;
  y?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BusinessMiniService {

  private state$ = new BehaviorSubject<BusinessMiniState>({ open: false });
  get state(): Observable<BusinessMiniState> { return this.state$.asObservable(); }

  open(position: { x: number; y: number }) {
    this.state$.next({ open: true, x: position.x, y: position.y });
  }

  close() {
    this.state$.next({ open: false });
  }

  toggle(position?: { x: number; y: number }) {
    const curr = this.state$.value;
    if (curr.open) {
      this.close();
    } else if (position) {
      this.open(position);
    } else {
      this.open({ x: 0, y: 0 });
    }
  }
}
