import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartItem } from '../cart-item.model';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-page',
  standalone:false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  form!: FormGroup;
  cartItems: CartItem[] = [];
  totalPrice = 0;

  constructor(
    private fb: FormBuilder,
    private cart: CartService,
    private checkoutSvc: CheckoutService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });
    this.cart.getCart().subscribe(items => {
      this.cartItems = items;
      this.totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);
    });
  }

  continueToPayment() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.checkoutSvc.setShipping({
      ...this.form.value,
      items: this.cartItems,
      totalPrice: this.totalPrice
    });

    this.router.navigate(['/payment/confirm-payment']);
  }
}
