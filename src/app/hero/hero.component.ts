import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  bannerImages: string[] = [
    'https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg',
    'https://cdn.pixabay.com/photo/2015/09/14/11/43/restaurant-939435_640.jpg',
    'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  ];
  @Output() scrollToMenu = new EventEmitter<void>();

  currentIndex: number = 0;

  constructor() {}

  ngOnInit() {
    this.startImageSlider();
  }

  startImageSlider() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.bannerImages.length;
    }, 3000);
  }
}
