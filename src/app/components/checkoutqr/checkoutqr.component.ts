import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as QRCode from 'qrcode';
@Component({
  selector: 'app-checkoutqr',
  templateUrl: './checkoutqr.component.html',
  styleUrl: './checkoutqr.component.css',
})
export class CheckoutqrComponent {
  @Input() qrData: string = ''; // Data to encode in the QR code
  @Output() close = new EventEmitter<void>();

  qrCodeUrl: string = '';

  ngOnInit(): void {
    this.generateQRCode();
  }

  generateQRCode(): void {
    if (!this.qrData) return;
    QRCode.toDataURL(this.qrData)
      .then((url) => {
        this.qrCodeUrl = url;
      })
      .catch((err) => {
        console.error('QR Code generation failed:', err);
      });
  }

  closeModal(): void {
    this.close.emit();
  }
}
