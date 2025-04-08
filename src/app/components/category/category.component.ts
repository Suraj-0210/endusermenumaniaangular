import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  @Input() categories: string[] = [];
  @Output() categorySelected = new EventEmitter<string>();

  categoryIcons: { [key: string]: string } = {
    All: '☰',
    Biriyani: '🍔',
    Breakfast: '🍕',
    Dessert: '🥤',
    Snacks: '🍰',
    Salads: '🥗',
    Sushi: '🍣',
  };

  handleCategorySelect(category: string) {
    this.categorySelected.emit(category);
  }
}
