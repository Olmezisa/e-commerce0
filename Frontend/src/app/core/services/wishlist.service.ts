// src/app/core/services/wishlist.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { ProductService } from './product.service';
import { Product } from '../../products/models/product.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly STORAGE_KEY = 'wishlistIds';
  private readonly isBrowser: boolean;

  private ids: number[] = [];

  private itemsSubject = new BehaviorSubject<Product[]>([]);
  public readonly items$ = this.itemsSubject.asObservable();

  private countSubject = new BehaviorSubject<number>(0);
  public readonly count$ = this.countSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private productSvc: ProductService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        try {
          this.ids = JSON.parse(raw);
        } catch {
          console.warn('Wishlist IDs parse hatası, sıfırlanıyor');
          this.ids = [];
        }
      }
    }

    this.reloadProducts();
  }

  toggle(product: Product): void {
    const idx = this.ids.indexOf(product.id);
    if (idx > -1) {
      this.ids.splice(idx, 1);
    } else {
      this.ids.push(product.id);
    }
    this.commit();
    this.reloadProducts();
  }

  isInWishlist(productId: number): boolean {
    return this.ids.includes(productId);
  }

  clearWishlist(): void {
    this.ids = [];
    this.commit();
    this.itemsSubject.next([]);
    this.countSubject.next(0);
  }
  private commit(): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.ids));
      } catch {
        console.warn('Wishlist IDs kaydetme hatası');
      }
    }
    this.countSubject.next(this.ids.length);
  }

  private reloadProducts(): void {
    if (this.ids.length === 0) {
      this.itemsSubject.next([]);
      this.countSubject.next(0);
      return;
    }

    const calls = this.ids.map(id =>
      this.productSvc.getProductById(id).pipe(
        catchError(_ => {
          this.ids = this.ids.filter(x => x !== id);
          this.commit();
          return of(null);
        })
      )
    );

    forkJoin(calls).subscribe(results => {
      const prods = results.filter((p): p is Product => p != null);
      this.itemsSubject.next(prods);
      this.countSubject.next(prods.length);
    });
  }
}
