import {
  Component,
  EventEmitter,
  input,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DishService } from '../../services/dish.service';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrl: './dishes.component.css',
})
export class DishesComponent {
  allDishes: any[] = [];
  filteredDishes: any[] = [];
  categories: string[] = [];
  loading: boolean = true;
  error: string = '';
  @Output() addDishToCart = new EventEmitter<any>();
  @Output() extractingCategories = new EventEmitter<any>();
  @Output() sendAllDishes = new EventEmitter<any>();
  @Input() selectedCategory: string = '';
  @Input() restaurantId: string | null = 'your_restaurant_id_here';
  readMoreStates: { [key: string]: boolean } = {};

  constructor(private dishService: DishService) {}

  ngOnInit() {
    this.fetchDishes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCategory']) {
      console.log(this.selectedCategory);
      this.filterDishes();
    }
  }

  selectedDish: any = null;

  openDishModal(dish: any) {
    this.selectedDish = dish;
    // Bootstrap 5 JS API
    (window as any).bootstrap.Modal.getOrCreateInstance(
      document.getElementById('dishModal')!
    ).show();
  }

  closeModal() {
    (window as any).bootstrap.Modal.getInstance(
      document.getElementById('dishModal')!
    )?.hide();
  }

  filterDishes() {
    if (this.selectedCategory) {
      if (this.selectedCategory != 'All') {
        this.filteredDishes = this.allDishes.filter(
          (dish) => dish.category === this.selectedCategory
        );
      } else {
        this.filteredDishes = [...this.allDishes];
      }
    } else {
      this.filteredDishes = [...this.allDishes];
    }
  }

  fetchDishes() {
    this.dishService.fetchAllDishes(this.restaurantId).subscribe({
      next: (data) => {
        this.allDishes = data;
        this.sendAllDishes.emit(this.allDishes);
        this.extractCategories(); // Extract categories
        this.filterDishes(); // Filter dishes initially
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  extractCategories() {
    this.categories = [
      'All',
      ...new Set(this.allDishes.map((dish) => dish.category)),
    ];
    this.extractingCategories.emit(this.categories);
    console.log(this.categories);
  }

  toggleReadMore(dishId: string) {
    this.readMoreStates[dishId] = !this.readMoreStates[dishId];
  }

  handleAddToCart(dish: any) {
    console.log('Adding to cart:', dish);
    this.addDishToCart.emit(dish); // Emit dish to parent
  }
}
