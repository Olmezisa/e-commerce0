import { Component, OnInit }    from '@angular/core';
import { ActivatedRoute }       from '@angular/router';
import { ProductService }       from '../../core/services/product.service';
import { Product }              from '../models/product.model';
import { switchMap }            from 'rxjs/operators';
import { Observable, of }       from 'rxjs';

@Component({
  selector: 'app-search-page',
  standalone:false,
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {
  query!: string;
  results: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // queryParamMap değiştikçe çalışacak
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const q = params.get('q')?.trim() ?? '';
        this.query = q;
        if (!q) return of<Product[]>([]);
        // Tüm ürünleri alıp filtrele
        return this.productService.getProducts();
      })
    ).subscribe(list => {
      if (this.query) {
        const lower = this.query.toLowerCase();
        this.results = list.filter(p =>
          p.name.toLowerCase().includes(lower)
        );
      } else {
        this.results = [];
      }
    });
  }
}
