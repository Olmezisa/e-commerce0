import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from '../cart-item.model';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart-list',
  standalone: false,
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit {
  cartItems: (CartItem & { isUpdating?: boolean })[] = [];
  totalPrice = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refreshCart();
  }

  refreshCart(): void {
    this.cartService.getCart().subscribe(items => {
      this.cartItems   = items;
      this.totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    });
  }

  viewDetails(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  removeItem(item: CartItem, event: MouseEvent): void {
    event.stopPropagation();
    this.cartService
      .removeFromCart(item.productId, item.variantId)
      .subscribe(() => this.refreshCart());
  }

  increaseQty(item: CartItem, event: MouseEvent): void {
    event.stopPropagation();
    this.cartService
      .addToCart(item.productId, 1, item.variantId)
      .subscribe(() => this.refreshCart());
  }

  decreaseQty(item: CartItem, event: MouseEvent): void {
    event.stopPropagation();

    if (item.quantity > 1) {
      this.cartService
        .addToCart(item.productId, -1, item.variantId)
        .subscribe(() => this.refreshCart());
    } else {
      this.removeItem(item, event);
    }
  }
}
