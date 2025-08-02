import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NotificationService,
  ToastMessage,
} from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.toasts$.subscribe(
      (toasts) => (this.toasts = toasts)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeToast(id: string): void {
    this.notificationService.removeToast(id);
  }

  executeAction(
    actionButton: { text: string; action: () => void },
    toastId: string
  ): void {
    actionButton.action();
    this.removeToast(toastId);
  }

  getToastIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-x-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'info':
        return 'bi-info-circle-fill';
      default:
        return 'bi-info-circle-fill';
    }
  }

  getToastClass(type: string): string {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      case 'info':
        return 'toast-info';
      default:
        return 'toast-info';
    }
  }

  trackByToastId(index: number, toast: ToastMessage): string {
    return toast.id;
  }
}
