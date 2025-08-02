import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../cart.service';
import { NotificationService } from '../../services/notification.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  @Input() showCart: boolean = false;
  @Output() toggleCart = new EventEmitter<void>();
  @Output() orderLengthChange = new EventEmitter<number>(); // Send cart length to navbar
  @Output() createOrder = new EventEmitter<{
    paymentId: string;
    confirmedOrders: any[];
    message: any;
  }>();
  @Input() sessionId: any;
  payAfterService: boolean = false;
  customMessage: string = '';

  @Input() order = [
    {
      _id: '124',
      dishname: 'Burger',
      price: 100,
      quantity: 1,
      image: 'burger.jpg',
      stock: 1,
    },
    {
      _id: '124',
      dishname: 'Pizza',
      price: 200,
      quantity: 2,
      image: 'pizza.jpg',
      stock: 1,
    },
  ];

  @Output() orderChange = new EventEmitter<any[]>(); // 👈 emit updated cart to parent

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}
  ngOnInit() {
    this.emitCartLength();
    console.log(this.order);
  }

  get totalPrice(): number {
    return this.order.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  changeQuantity(item: any, action: string) {
    const oldQuantity = item.quantity;
    this.order = this.order.map((cartItem) => {
      if (cartItem._id === item._id) {
        const newQuantity =
          action === 'add'
            ? cartItem.quantity + 1
            : Math.max(1, cartItem.quantity - 1);
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });

    const updatedItem = this.order.find(
      (cartItem) => cartItem._id === item._id
    );
    if (updatedItem && updatedItem.quantity !== oldQuantity) {
      const actionText = action === 'add' ? 'increased' : 'decreased';
      this.notificationService.showCartUpdate(
        `${item.dishname || item.name} quantity ${actionText} to ${
          updatedItem.quantity
        }`
      );
    }

    this.emitCartLength(); // Update cart count
    this.cartService.updateCart(this.order);
  }

  removeItem(item: any) {
    this.order = this.order.filter((cartItem) => cartItem._id !== item._id);
    this.notificationService.showCartUpdate(
      `${item.dishname || item.name} removed from cart`
    );
    this.emitCartLength(); // Update cart count
    this.cartService.updateCart(this.order);
  }

  payNow() {
    if (this.payAfterService) {
      this.notificationService.showSuccess({
        title: 'Order Placed!',
        message: `Order placed with Cash on Delivery. Total: ₹${this.totalPrice}`,
        duration: 4000,
      });
      this.handlePaymentSuccess('Pay_After_Service');
      this.order = [];
      this.emitCartLength();
      this.cartService.updateCart([]);
      this.customMessage = '';
      return;
    }

    // Razorpay Payment Flow
    fetch(`${environment.apiUrl}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: this.totalPrice * 100 }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          const options = {
            key: 'rzp_test_hlOwDlGGp9emrY',
            amount: data.amount,
            currency: data.currency,
            name: 'MenuMania',
            description: 'Test Transaction',
            order_id: data.id,
            handler: (response: any) => {
              this.notificationService.showSuccess({
                title: 'Payment Successful!',
                message: `Payment completed successfully. ID: ${response.razorpay_payment_id}`,
                duration: 4000,
              });
              this.handlePaymentSuccess(response.razorpay_payment_id);
              this.order = [];
              this.emitCartLength();
              this.cartService.updateCart([]);
              this.customMessage = '';
            },
            prefill: {
              name: 'Customer Name',
              email: 'customer@example.com',
              contact: '9999999999',
            },
            theme: {
              color: '#F37254',
            },
          };

          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
        } else {
          this.notificationService.showError({
            title: 'Payment Error',
            message: 'Failed to create Razorpay order.',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        this.notificationService.showError({
          title: 'Payment Error',
          message: 'Something went wrong while initiating payment.',
        });
      });
  }

  handlePaymentSuccess(paymentId: string) {
    console.log(this.order);
    const confirmedOrders = this.order.map((item) => ({
      menuItem: item._id, // Correct key expected by backend
      quantity: item.quantity,
    }));

    this.createOrder.emit({
      paymentId,
      confirmedOrders,
      message: this.customMessage,
    }); // emit clean structure
    console.log(confirmedOrders);
    this.order = [];
    this.emitCartLength();
  }

  emitCartLength() {
    this.orderLengthChange.emit(this.order.length); // Emit cart length
  }
}
