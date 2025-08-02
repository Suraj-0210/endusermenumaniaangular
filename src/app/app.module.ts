import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './components/cart/cart.component';
import { HeroComponent } from './hero/hero.component';
import { CategoryComponent } from './components/category/category.component';

import { DishesComponent } from './components/dishes/dishes.component';
import { FooterComponent } from './footer/footer.component';
import { OrdersComponent } from './orders/orders.component';
import { CheckoutqrComponent } from './components/checkoutqr/checkoutqr.component';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    CartComponent,
    HeroComponent,
    CategoryComponent,
    DishesComponent,
    FooterComponent,
    OrdersComponent,
    CheckoutqrComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
