import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProductService } from '../../core/services/product.service';
import { ReviewService } from '../../core/services/review.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

import { Product } from '../models/product.model';
import { ProductVariant } from '../models/variant.model';
import { Review } from '../models/review.model';

@Component({
  selector: 'app-product-detail-page',
  standalone: false,
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.css']
})
export class ProductDetailPageComponent implements OnInit {
  product: Product | null = null;
  variants: ProductVariant[] = [];
  selectedVariant: ProductVariant | null = null;
  quantity = 1;

  reviews: Review[] = [];
  reviewForm!: FormGroup;
  isLoggedIn$: Observable<boolean>;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private fb: FormBuilder,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      product: this.productService.getProductById(id).pipe(
        tap(() => console.log('🔍 product isteği yapıldı')),
        catchError(err => {
          console.error('Ürün hatası', err);
          return of(null);
        })
      ),
      variants: this.productService.getVariants(id).pipe(
        tap(() => console.log('🔍 variants isteği yapıldı')),
        catchError(err => {
          console.error('Varyant hatası', err);
          return of([] as ProductVariant[]);
        })
      ),
      reviews: this.reviewService.getReviews(id).pipe(
        tap(() => console.log('🔍 reviews isteği yapıldı')),
        catchError(err => {
          console.error('Yorum hatası', err);
          return of([] as Review[]);
        })
      )
    }).subscribe({
      next: ({ product, variants, reviews }) => {
        this.product = product;
        this.variants = variants;
        this.selectedVariant = variants.length > 0 ? variants[0] : null;
        this.reviews = reviews;

        const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
        this.product!.rating = reviews.length ? +(sum / reviews.length).toFixed(1) : 0;

        this.reviewForm = this.fb.group({
          rating: [5, Validators.required],
          comment: ['', Validators.required]
        });

        this.loading = false;
      },
      error: err => {
        console.error('❌ forkJoin error:', err);
        this.loading = false;
      }
    });
  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService
      .addToCart(this.product.id, this.quantity, this.selectedVariant?.id)
      .subscribe({
        next: () =>
          this.snackBar.open('Ürün sepete eklendi!', 'Kapat', { duration: 2000 }),
        error: err =>
          this.snackBar.open(`Hata: ${err.message}`, 'Kapat', { duration: 2000 })
      });
  }

  submitReview(): void {
    if (!this.product || this.reviewForm.invalid) return;

    this.reviewService.postReview(this.product.id, this.reviewForm.value).subscribe({
      next: () => {
        this.snackBar.open('Yorumunuz kaydedildi!', 'Kapat', { duration: 2000 });

        this.reviewService.getReviews(this.product!.id).subscribe(r => {
          this.reviews = r;

          const sum = r.reduce((acc, rev) => acc + rev.rating, 0);
          this.product!.rating = r.length ? +(sum / r.length).toFixed(1) : 0;
        });

        this.reviewForm.reset({ rating: 5, comment: '' });
      },
      error: () => {
        this.snackBar.open('Yorum gönderilirken hata oluştu.', 'Kapat', { duration: 2000 });
      }
    });
  }
}
