import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() restaurantDetails: any;
  @Input() cart: any[] = [];
  @Output() cartChange = new EventEmitter<any[]>();
  @Input() dishes: any[] = [];
  @Input() sessionId: any;
  @Input() tableNumber: any;
  @Input() restaurantId: any;

  @Output() cartLengthChange = new EventEmitter<number>(); // optional if needed separately

  baseURL = 'https://endusermenumania.onrender.com';
  paidOrders: any = [];
  confirmedOrders: any;
  menuOpen = false;
  showCart = false;

  cartLength: number = this.cart.length;

  searchQuery: string = '';
  showDropdown: boolean = false;
  filteredDishes: any[] = [];

  showOrders: boolean = false;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart; // real-time update
    });
  }

  handleCartUpdate(updatedCart: any[]) {
    this.cartChange.emit(updatedCart); // 🔁 Pass it to parent
  }

  toggleOrders() {
    this.showOrders = !this.showOrders;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cart']) {
      this.updateCartLength(this.cart.length);
    }
  }

  updateCartLength(length: number) {
    this.cartLength = length;
  }

  toggleCart() {
    this.showCart = !this.showCart;
  }

  filterDishes() {
    if (this.searchQuery.trim() === '') {
      this.filteredDishes = [];
      return;
    }
    this.filteredDishes = this.dishes.filter((dish) =>
      dish.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  hideDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  handleCreateOrder(event: { paymentId: string; confirmedOrders: any[] }) {
    const { paymentId, confirmedOrders } = event;
    this.sendOrderToBackend(paymentId, confirmedOrders);
  }

  async sendOrderToBackend(paymentId: string, confirmedOrders: any[]) {
    try {
      const body = {
        dishes: confirmedOrders,
        restaurantId: this.restaurantId,
        tableNo: this.tableNumber,
        sessionId: this.sessionId,
        paymentId: paymentId,
        status: 'Completed',
      };

      const response = await fetch(`${this.baseURL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Order created successfully:', result);
        this.confirmedOrders = [];
      } else {
        throw new Error('Failed to place order.');
      }
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  }

  addToCart(dish: any) {
    const existingItem = this.cart.find((item) => item._id == dish._id);

    if (existingItem) {
      existingItem.quantity += 1; // Increase quantity if dish exists
    } else {
      // Add new dish
      this.cart = [...this.cart, { ...dish, quantity: 1 }];
      this.cartService.updateCart(this.cart);
    }
  }
}
