import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  showCloseButton?: boolean;
  actionButton?: {
    text: string;
    action: () => void;
  };
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private readonly DEFAULT_DURATION = 3000;
  private readonly MAX_TOASTS = 5;

  constructor() {}

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private addToast(toast: Omit<ToastMessage, 'id' | 'timestamp'>): void {
    const newToast: ToastMessage = {
      ...toast,
      id: this.generateId(),
      timestamp: Date.now(),
      duration: toast.duration ?? this.DEFAULT_DURATION,
      showCloseButton: toast.showCloseButton ?? true,
    };

    const currentToasts = this.toastsSubject.value;

    // Limit the number of toasts
    const updatedToasts = [newToast, ...currentToasts].slice(
      0,
      this.MAX_TOASTS
    );
    this.toastsSubject.next(updatedToasts);

    // Auto-dismiss toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.removeToast(newToast.id);
      }, newToast.duration);
    }
  }

  showSuccess(config: {
    title: string;
    message: string;
    duration?: number;
    actionButton?: { text: string; action: () => void };
  }): void {
    this.addToast({
      type: 'success',
      ...config,
    });
  }

  showError(config: {
    title: string;
    message: string;
    duration?: number;
    actionButton?: { text: string; action: () => void };
  }): void {
    this.addToast({
      type: 'error',
      ...config,
      duration: config.duration ?? 5000, // Errors stay longer
    });
  }

  showWarning(config: {
    title: string;
    message: string;
    duration?: number;
    actionButton?: { text: string; action: () => void };
  }): void {
    this.addToast({
      type: 'warning',
      ...config,
      duration: config.duration ?? 4000, // Warnings stay a bit longer
    });
  }

  showInfo(config: {
    title: string;
    message: string;
    duration?: number;
    actionButton?: { text: string; action: () => void };
  }): void {
    this.addToast({
      type: 'info',
      ...config,
    });
  }

  removeToast(id: string): void {
    const currentToasts = this.toastsSubject.value;
    const updatedToasts = currentToasts.filter((toast) => toast.id !== id);
    this.toastsSubject.next(updatedToasts);
  }

  clearAll(): void {
    this.toastsSubject.next([]);
  }

  // Convenience methods for cart operations
  showCartSuccess(dishName: string, quantity: number = 1): void {
    this.showSuccess({
      title: 'Added to Cart!',
      message: `${dishName} ${
        quantity > 1 ? `(${quantity})` : ''
      } added successfully`,
      duration: 2500,
    });
  }

  showCartError(message: string): void {
    this.showError({
      title: 'Cannot Add to Cart',
      message: message,
    });
  }

  showCartWarning(message: string): void {
    this.showWarning({
      title: 'Cart Notice',
      message: message,
    });
  }

  showCartUpdate(message: string): void {
    this.showInfo({
      title: 'Cart Updated',
      message: message,
      duration: 2000,
    });
  }
}
