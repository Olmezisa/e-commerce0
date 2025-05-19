import { CartService } from './../../core/services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ConfirmOrderReq, OrderService, PaymentCreateResp } from '../../core/services/order.service';
import { Router } from '@angular/router';
import { CheckoutService, ShippingInfo } from '../../core/services/checkout.service';
import { Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-confirm-payment',
  standalone: false,
  templateUrl: './confirm-payment.component.html',
  styleUrl: './confirm-payment.component.css'
})
export class ConfirmPaymentComponent implements OnInit{
  shipping!: ShippingInfo;
  stripe!: Stripe;
  elements!: StripeElements;
  card!: StripeCardElement;
  clientSecret!: string;
  paymentIntentId!: string;
  errorMessage = '';

  constructor(
    private checkoutSvc: CheckoutService,
    private orderSvc: OrderService,
    private router: Router,
    private cartService:CartService
  ) {}

  async ngOnInit() {
    const info = this.checkoutSvc.getShippingInfo();
    if (!info) {
      // bilgi yoksa geri yönlendir
      this.router.navigate(['/cart/checkout']);
      return;
    }
    this.shipping = info;

    // Stripe init
    const stripeInstance = await loadStripe(environment.stripePublishableKey);
    if (!stripeInstance) {
      this.errorMessage = 'Stripe failed to load.';
      return;
    }
    this.stripe = stripeInstance;
    this.elements = this.stripe.elements();
    this.card = this.elements.create('card');
    this.card.mount('#card-element');

    // PaymentIntent
    this.orderSvc.createPayment(this.shipping.totalPrice)
      .subscribe((r: PaymentCreateResp) => {
        this.clientSecret = r.clientSecret;
        this.paymentIntentId = r.paymentIntentId;
      }, err => this.errorMessage = err.error?.message || err.message);
  }

  async pay() {
    const { error, paymentIntent } = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: { card: this.card }
    });
    if (error) {
      this.errorMessage = error.message || 'Ödeme hatası';
      return;
    }
    if (paymentIntent?.status === 'succeeded') {
      const req: ConfirmOrderReq = {
        paymentIntentId: this.paymentIntentId,
        items: this.shipping.items.map(i => ({
          productId: i.productId,
          quantity: i.quantity
        }))
      };
      this.orderSvc.confirmOrder(req).subscribe(
        order => {
          // başarıyla tamamlandı
          this.cartService.clearCart().subscribe(()=>{
          this.checkoutSvc.clear();
          this.router.navigate(['/orders/my-orders'], {
            state: { orderId: order.orderId },

          });
        });

        },
        err => this.errorMessage = err.error?.message || err.message
      );
    }
  }
}
