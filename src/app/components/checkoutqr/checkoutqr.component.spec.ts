import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutqrComponent } from './checkoutqr.component';

describe('CheckoutqrComponent', () => {
  let component: CheckoutqrComponent;
  let fixture: ComponentFixture<CheckoutqrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckoutqrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
