import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Product } from '../models/product.model';
import { ProductService } from '../../core/services/product.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-product-compare-page',
  standalone: false,
  templateUrl: './product-compare-page.component.html',
  styleUrls: ['./product-compare-page.component.css']
})


export class ProductComparePageComponent implements OnInit {
  product1?: Product;
  product2?: Product;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const id1 = Number(params.get('product1'));
      const id2 = Number(params.get('product2'));

      if (!id1 || !id2) {
        this.loading = false;
        return;
      }

      forkJoin([
        this.productService.getProductById(id1),
        this.productService.getProductById(id2)
      ]).subscribe({
        next: ([p1, p2]) => {
          this.product1 = p1;
          this.product2 = p2;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    });
  }
}

