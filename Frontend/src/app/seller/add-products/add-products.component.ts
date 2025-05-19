import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Router } from '@angular/router';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-add-products',
  standalone: false,
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.css'
})
export class AddProductsComponent implements OnInit {
  productForm!: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Formu oluştur
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      categoryId: [null, Validators.required]
    });

    this.categoryService.getAllCategories().subscribe({
      next: cats => this.categories = cats,
      error: err => console.error('Kategori yüklenemedi:', err)
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.productService.addProduct(this.productForm.value).subscribe({
        next: () => {
          alert('Ürün eklendi!');
          this.router.navigate(['/seller/seller-dashboard']);
        },
        error: err => {
          console.error('Ürün ekleme hatası', err);
          alert(`Hata! ${err.status} - ${err.message}`);
        }
      });
    }
  }
}
