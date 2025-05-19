import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  tap
} from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import Fuse from 'fuse.js';
import { Product } from '../../../products/models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  standalone: false
})
export class SearchBarComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('', { nonNullable: true });
  suggestions: Product[] = [];
  allProducts: Product[] = [];
  private sub!: Subscription;
  private fuse!: Fuse<Product>;

  @Output() search = new EventEmitter<string>();

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(list => {
      this.allProducts = list;
      this.fuse = new Fuse(list, {
        keys: ['name'],
        threshold: 0.4,
        includeScore: true
      });
    });

    this.sub = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(term => {
        const q = term.trim();
        if (!q) {
          this.suggestions = [];
        }
      }),
      filter(term => term.trim().length > 0),
      tap(term => {
        const results = this.fuse.search(term).slice(0, 5);
        this.suggestions = results.map(r => r.item);
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSelect(product: Product): void {
    this.router.navigate(['/products', product.id]);
    this.clear();
  }

  onSubmit(): void {
    const term = this.searchControl.value.trim();
    if (!term) return;

    this.search.emit(term);
    this.clear();
  }

  clear(): void {
    this.searchControl.setValue('');
    this.suggestions = [];
  }
}
