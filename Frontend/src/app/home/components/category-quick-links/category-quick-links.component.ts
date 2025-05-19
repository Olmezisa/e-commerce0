import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-quick-links',
  standalone: false,
  templateUrl: './category-quick-links.component.html',
  styleUrls: ['./category-quick-links.component.css']
})
export class CategoryQuickLinksComponent implements OnInit {
  categories: Category[] = [];

  // Tümü için null da gönderilebilir
  @Output() categorySelected = new EventEmitter<{ id: number; name: string } | null>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      const categoryMap = new Map<number, Category>();

      products.forEach(p => {
        if (p.category?.id && p.category?.name) {
          categoryMap.set(p.category.id, {
            id: p.category.id,
            name: p.category.name
          });
        }
      });

      this.categories = Array.from(categoryMap.values());
    });
  }

  select(category: Category) {
    this.categorySelected.emit({ id: category.id, name: category.name });
  }
}
