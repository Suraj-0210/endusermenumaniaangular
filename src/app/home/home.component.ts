import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../services/restaurant.service';
import { CartService } from '../cart.service';
import { NotificationService } from '../services/notification.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  restaurantId: string | null = null;
  tableNumber: string | null = null;
  restaurantDetails: any = null;
  allDishes: any = [];
  loading = false;
  error: string | null = null;
  selectedCategory: string = '';
  sessionId: string = '';

  categories = [];

  onCategorySelected(category: string) {
    this.selectedCategory = category;
    console.log('Selected Category:', category);
  }

  cart: any[] = []; // Cart state

  // Function to add items to cart
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

  extractCategories(categories: []) {
    this.categories = categories;
  }

  // Function to update cart (from CartComponent)
  updateCart(cart: any[]) {
    this.cart = cart;
  }

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Extract restaurantId and tableNumber
    const param$ = this.route.paramMap;
    const query$ = this.route.queryParamMap;

    combineLatest([param$, query$]).subscribe(([paramMap, queryMap]) => {
      this.restaurantId = paramMap.get('restaurantId');
      this.tableNumber = queryMap.get('table');

      if (this.restaurantId && this.tableNumber) {
        console.log('restaurantId:', this.restaurantId);
        console.log('tableNumber:', this.tableNumber);

        // Now both values are available - do your logic here
        this.getRestaurantDetails(this.restaurantId, this.tableNumber);
      }
    });

    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart; // always in sync
    });

    console.log(this.restaurantId);
    console.log(this.tableNumber);
  }

  getRestaurantDetails(restaurantId: string, tableno: any) {
    this.loading = true;
    this.error = null;
    this.restaurantService
      .fetchRestaurantDetails(restaurantId, tableno)
      .subscribe({
        next: (data) => {
          console.log('Restaurant Data:', data);
          this.restaurantDetails = data;

          if (data?.sessionId) {
            document.cookie = `sessionId=${data.sessionId}; path=/;`;
            this.sessionId = data.sessionId;
          }
        },
        error: (err) => {
          this.error = 'Failed to fetch restaurant details.';
          console.error(err);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  getAllDishes(dishes: any) {
    if (dishes) {
      this.allDishes = dishes;
    }
  }
  scrollToDishes() {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
