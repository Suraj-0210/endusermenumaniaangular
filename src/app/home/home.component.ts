import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../services/restaurant.service';
import { CartService } from '../cart.service';

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
      existingItem.quantity += 1; // Increase quantity if dish exists
    } else {
      // Add new dish
      this.cart = [...this.cart, { ...dish, quantity: 1 }];
      this.cartService.updateCart(this.cart);
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
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Extract restaurantId and tableNumber
    this.route.paramMap.subscribe((params) => {
      this.restaurantId = params.get('restaurantId');
      if (this.restaurantId) {
        this.getRestaurantDetails(this.restaurantId);
      }
    });

    this.route.queryParamMap.subscribe((params) => {
      this.tableNumber = params.get('table');
    });

    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart; // always in sync
    });

    console.log(this.restaurantId);
    console.log(this.tableNumber);
  }

  getRestaurantDetails(restaurantId: string) {
    this.loading = true;
    this.error = null;
    this.restaurantService.fetchRestaurantDetails(restaurantId).subscribe({
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
