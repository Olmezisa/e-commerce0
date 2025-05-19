import { Component, OnInit } from '@angular/core';
import { Category } from '../../core/models/category.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-category-management',
  standalone: false,
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  categoryForm!: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(cats => this.categories = cats);
  }

  addCategory(): void {
    if (this.categoryForm.invalid) return;

    this.categoryService.createCategory(this.categoryForm.value.name).subscribe(() => {
      this.categoryForm.reset();
      this.loadCategories();
    });
  }

  deleteCategory(id: number): void {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;

    this.categoryService.deleteCategory(id).subscribe(() => {
      this.categories = this.categories.filter(c => c.id !== id);
    });
  }
}
