import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkoutqr',
  templateUrl: './checkoutqr.component.html',
  styleUrl: './checkoutqr.component.css',
})
export class CheckoutqrComponent {
  @Input() qrCodeUrl!: string;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
