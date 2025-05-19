import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../models/product.model';
import { ProductVariant } from '../models/variant.model';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-product-list-page',
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css',
  standalone: false
})
export class ProductListPageComponent implements OnInit {
  categoryId: number | null = null;
  categoryName: string | null = null;
  searchTerm = '';
  statusFilter: 'PENDING' | 'ACTIVE' | 'BANNED' = 'ACTIVE';

  products: Product[] = [];
  filtered: Product[] = [];
  selectedProducts: Product[] = [];

  variantOptions: Record<number, ProductVariant[]> = {};
  selectedVariant: Record<number, number | null> = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private wishlist: WishlistService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = +params['category'];
      const search = params['search']?.trim().toLowerCase() ?? '';
      this.categoryId = isNaN(id) ? null : id;
      this.searchTerm = search;

      if (this.categoryId) {
        this.categoryService.getAllCategories().subscribe(cats => {
          const found = cats.find(c => c.id === this.categoryId);
          this.categoryName = found?.name ?? null;
        });
      }

      this.fetchProducts();
    });
  }

  fetchProducts(): void {
    const source$ = this.categoryId
      ? this.productService.getProductsByCategory(this.categoryId)
      : this.productService.getProducts(this.statusFilter);

    source$.subscribe(list => {
      this.products = list;
      this.applyFilter();
      this.initVariants(list);
    });
  }

  private initVariants(list: Product[]): void {
    list.forEach(p => {
      this.productService.getVariants(p.id).subscribe(vars => {
        this.variantOptions[p.id] = vars;
        this.selectedVariant[p.id] = vars.length ? vars[0].id : null;
      });
    });
  }

  private applyFilter(): void {
    this.filtered = this.searchTerm
      ? this.products.filter(p =>
          p.name.toLowerCase().includes(this.searchTerm)
        )
      : this.products;
  }

  onSearch(term: string): void {
    this.searchTerm = term.trim().toLowerCase();
    this.applyFilter();
  }

  viewDetails(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  addToCart(product: Product, event: MouseEvent): void {
    event.stopPropagation();
    const variantId = this.selectedVariant[product.id] ?? undefined;
    this.cartService.addToCart(product.id, 1, variantId).subscribe({
      next: () => {
        this.snackBar.open(`${product.name} sepete eklendi.`, 'Kapat', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: err => {
        this.snackBar.open(`Sepete eklenemedi: ${err.message}`, 'Kapat', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  toggleWishlist(product: Product, event: MouseEvent): void {
    event.stopPropagation();
    this.wishlist.toggle(product);
  }

  isWishlisted(p: Product): boolean {
    return this.wishlist.isInWishlist(p.id);
  }

  addToCompare(product: Product, event: MouseEvent): void {
    event.stopPropagation();
    if (!this.selectedProducts.includes(product) && this.selectedProducts.length < 2) {
      this.selectedProducts.push(product);
    }
  }

  compareSelected(event: MouseEvent): void {
    event.stopPropagation();
    if (this.selectedProducts.length === 2) {
      this.router.navigate(['/products/compare'], {
        queryParams: {
          product1: this.selectedProducts[0].id,
          product2: this.selectedProducts[1].id
        }
      });
      this.selectedProducts = [];
    }
  }
}
