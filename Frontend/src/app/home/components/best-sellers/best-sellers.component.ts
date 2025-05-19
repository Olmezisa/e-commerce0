import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../products/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-best-sellers',
  standalone: false,
  templateUrl: './best-sellers.component.html',
  styleUrl: './best-sellers.component.css'
})
export class BestSellersComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productService.getProducts('ACTIVE').subscribe({
      next: products => {
        this.products = products
          .sort((a, b) => b.price - a.price)
          .slice(0, 4); // Örnek sıralama
      },
      error: err => {
        console.error('Best sellers yüklenirken hata oluştu:', err);
      }
    });
  }

  addToCart(product: Product, event: MouseEvent): void {
    event.stopPropagation();
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        this.snackBar.open(`${product.name} sepete eklendi.`, 'Kapat', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: err => {
        this.snackBar.open(`Sepete eklenemedi: ${err.message}`, 'Kapat', {
          duration: 3000
        });
      }
    });
  }

  toggleWishlist(product: Product, event: MouseEvent): void {
    event.stopPropagation();
    this.wishlistService.toggle(product);
  }

  isWishlisted(p: Product): boolean {
    return this.wishlistService.isInWishlist(p.id);
  }
}
