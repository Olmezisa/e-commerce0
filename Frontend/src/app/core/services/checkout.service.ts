import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../cart/cart-item.model';

export interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private shipping$ = new BehaviorSubject<ShippingInfo | null>(null);
  shippingInfo$ = this.shipping$.asObservable();

  setShipping(info: ShippingInfo) {
    this.shipping$.next(info);
  }

  clear() {
    this.shipping$.next(null);
  }
  getShippingInfo(): ShippingInfo | null {
    return this.shipping$.getValue();
  }
}
