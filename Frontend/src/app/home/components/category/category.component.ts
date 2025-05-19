import { Component, ElementRef, HostListener } from '@angular/core';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: cats => this.categories = cats,
      error: err => console.error('❌ Kategoriler alınamadı:', err)
    });
  }

  onCategory(cat: Category) {
    this.router.navigate(['/products'], { queryParams: { category: cat.id } });
  }
}
