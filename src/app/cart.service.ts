// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

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

  private hasOrdered = new BehaviorSubject<boolean>(false);
  hasOrdered$ = this.hasOrdered.asObservable(); // Exposed observable for components

  setHasOrdered(isOrdered: boolean) {
    this.hasOrdered.next(isOrdered);
  }

  getIfOrdered(): boolean {
    return this.hasOrdered.getValue(); // for sync access
  }
}
