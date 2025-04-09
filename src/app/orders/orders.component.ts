import { Component, Input } from '@angular/core';
import jsPDF from 'jspdf';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  @Input() showModal = false;
  @Input() paidOrders: any[] | null = null;
  @Input() sessionId: any;
  @Input() restaurantDetails: any;
  baseURL: string = 'https://endusermenumania.onrender.com';
  loading: boolean = true;

  closeModal() {
    this.showModal = false;
    this.orderService.closeConnection();
  }
  ngOnChanges() {
    this.sessionId = this.sessionId;
    console.log(this.paidOrders);
  }
  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrdersFromDb(this.sessionId).subscribe({
      next: (orders) => {
        this.paidOrders = orders;
        this.loading = false;
        console.log(orders);
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
      },
    });
  }

  generateBill(order: any) {
    const doc = new jsPDF();

    const base64Logo = this.restaurantDetails.logo;
    // Add logo
    doc.addImage(base64Logo, 'PNG', 80, 10, 50, 20); // centered logo
    let y = 40;

    const paymentModeText =
      order.paymentId === 'Pay_After_Service'
        ? 'Cash'
        : order.paymentId?.startsWith('pay_')
        ? 'Online'
        : 'N/A';

    // Restaurant Info
    doc.setFontSize(12);
    doc.text(`${this.restaurantDetails.restaurantname}`, 10, y);
    doc.text(`Order ID: ${order._id}`, 10, (y += 10));
    doc.text(`Date: ${new Date().toLocaleString()}`, 10, (y += 10));
    doc.text(`Payment Mode: ${paymentModeText}`, 10, (y += 10));
    doc.line(10, (y += 5), 200, y); // separator

    // Table Header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 10, (y += 10));
    doc.text('Qty', 100, y);
    doc.text('Price', 150, y);
    doc.setFont('helvetica', 'normal');

    // Items
    order.dishes.forEach((dish: any) => {
      const { name, price } = dish.menuItem;
      doc.text(name, 10, (y += 10));
      doc.text(`${dish.quantity}`, 100, y);
      doc.text(`INR ${(price * dish.quantity).toFixed(2)}`, 150, y);
    });

    // Total
    const total = order.dishes
      .reduce((sum: number, d: any) => sum + d.menuItem.price * d.quantity, 0)
      .toFixed(2);

    doc.line(10, (y += 10), 200, y);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: INR ${total}`, 150, (y += 10), { align: 'right' });

    // Footer
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for dining with us! ', 105, (y += 20), {
      align: 'center',
    });

    // Save the PDF
    doc.save(`Order_${order._id}_Bill.pdf`);
  }

  getTotalPrice(order: any): string {
    return order.dishes
      .reduce(
        (acc: number, dish: any) => acc + dish.menuItem.price * dish.quantity,
        0
      )
      .toFixed(2);
  }
}
