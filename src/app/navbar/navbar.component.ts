import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { CartService } from '../cart.service';
import { OrderService } from '../order.service';
import { NotificationService } from '../services/notification.service';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

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

  baseURL = environment.apiUrl;
  paidOrders: any = [];
  confirmedOrders: any;
  menuOpen = false;
  showCart = false;

  cartLength: number = this.cart.length;

  searchQuery: string = '';
  showDropdown: boolean = false;
  filteredDishes: any[] = [];

  showOrders: boolean = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart; // real-time update
    });

    this.orderSub = this.cartService.hasOrdered$.subscribe((value) => {
      this.hasOrdered = value;
    });
  }

  hasOrdered: boolean = false;
  private orderSub!: Subscription;

  ngOnDestroy() {
    if (this.orderSub) {
      this.orderSub.unsubscribe(); // prevent memory leaks
    }
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

  handleCreateOrder(event: {
    paymentId: string;
    confirmedOrders: any[];
    message: string;
  }) {
    const { paymentId, confirmedOrders, message } = event;
    this.sendOrderToBackend(paymentId, confirmedOrders, message);
  }

  async sendOrderToBackend(
    paymentId: string,
    confirmedOrders: any[],
    customMessage: string
  ) {
    this.orderService
      .sendOrderToBackend(
        confirmedOrders,
        this.restaurantId,
        this.tableNumber,
        this.sessionId,
        paymentId,
        customMessage
      )
      .then((result) => {
        this.confirmedOrders = [];
        this.cartService.setHasOrdered(true);
        // maybe close modal or show success alert
      })
      .catch((err) => {
        this.notificationService.showError({
          title: 'Order Failed',
          message: 'Failed to place order. Please try again.',
        });
      });
  }

  addToCart(dish: any) {
    console.log('added to cart');
    const existingItem = this.cart.find((item) => item._id == dish._id);

    if (existingItem) {
      if (existingItem.quantity < dish.stock) {
        existingItem.quantity += 1;
        this.cartService.updateCart(this.cart);
        this.notificationService.showCartSuccess(
          dish.name || dish.dishname,
          existingItem.quantity
        );
      } else {
        this.notificationService.showCartWarning(
          `Cannot add more ${dish.name || dish.dishname}. Stock limit reached.`
        );
      }
    } else {
      if (dish.stock > 0) {
        this.cart = [...this.cart, { ...dish, quantity: 1 }];
        this.cartService.updateCart(this.cart);
        this.notificationService.showCartSuccess(dish.name || dish.dishname);
      } else {
        this.notificationService.showCartError(
          `Cannot add ${dish.name || dish.dishname}. Item is out of stock.`
        );
      }
    }
  }

  showQRModal: boolean = false;

  toggleQRModal() {
    this.showQRModal = !this.showQRModal;
  }
}
