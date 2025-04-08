// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable(); // for components to subscribe

  updateCart(cart: any[]) {
    this.cartSubject.next(cart); // triggers updates to all subscribers
  }

  getCurrentCart() {
    return this.cartSubject.getValue(); // if you need to fetch current value
  }
}
