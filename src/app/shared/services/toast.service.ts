import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  public toasts$ = this.toastSubject.asObservable();
  private toastId = 0;

  show(type: Toast['type'], title: string, message: string, duration: number = 5000) {
    const toast: Toast = {
      id: ++this.toastId,
      type,
      title,
      message,
      duration
    };
    this.toastSubject.next(toast);
  }

  success(title: string, message: string, duration?: number) {
    this.show('success', title, message, duration);
  }

  error(title: string, message: string, duration?: number) {
    this.show('error', title, message, duration);
  }

  info(title: string, message: string, duration?: number) {
    this.show('info', title, message, duration);
  }

  warning(title: string, message: string, duration?: number) {
    this.show('warning', title, message, duration);
  }
}
