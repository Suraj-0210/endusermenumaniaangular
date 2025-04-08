import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../cart.service';

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
  }>();
  payAfterService: boolean = false;

  @Input() order = [
    {
      _id: '124',
      dishname: 'Burger',
      price: 100,
      quantity: 1,
      image: 'burger.jpg',
    },
    {
      _id: '124',
      dishname: 'Pizza',
      price: 200,
      quantity: 2,
      image: 'pizza.jpg',
    },
  ];

  @Output() orderChange = new EventEmitter<any[]>(); // 👈 emit updated cart to parent

  constructor(private cartService: CartService) {}
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
    this.emitCartLength(); // Update cart count
    this.cartService.updateCart(this.order);
  }

  removeItem(item: any) {
    this.order = this.order.filter((cartItem) => cartItem._id !== item._id);
    this.emitCartLength(); // Update cart count
    // this.orderChange.emit(this.order);
    this.cartService.updateCart(this.order);
  }

  payNow() {
    if (this.payAfterService) {
      alert(`Order placed with Cash on Delivery. Total: ₹${this.totalPrice}`);
      this.handlePaymentSuccess('Pay_After_Service');
      this.order = [];
      this.emitCartLength();
      this.cartService.updateCart([]);
      return;
    }

    // Razorpay Payment Flow
    fetch('https://endusermenumania.onrender.com/create-order', {
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
              alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
              this.handlePaymentSuccess(response.razorpay_payment_id);
              this.order = [];
              this.emitCartLength();
              // this.orderChange.emit([]);
              this.cartService.updateCart([]);
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
          alert('Failed to create Razorpay order.');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Something went wrong while initiating payment.');
      });
    // alert(`Order placed! Total: ₹${this.totalPrice}`);
    // this.order = [];
    // this.emitCartLength(); // Reset cart count
  }

  handlePaymentSuccess(paymentId: string) {
    console.log(this.order);
    const confirmedOrders = this.order.map((item) => ({
      menuItem: item._id, // Correct key expected by backend
      quantity: item.quantity,
    }));

    this.createOrder.emit({ paymentId, confirmedOrders }); // emit clean structure
    console.log(confirmedOrders);
    this.order = [];
    this.emitCartLength();
  }

  emitCartLength() {
    this.orderLengthChange.emit(this.order.length); // Emit cart length
  }
}
