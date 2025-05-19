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
  selectedFile:File|null=null;


  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required]
    });

    this.categoryService.getAllCategories().subscribe({
      next: cats => this.categories = cats,
      error: err => console.error('Kategori yüklenemedi:', err)
    });
  }
  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input?.files?.length) {
    this.selectedFile = input.files[0];
  }
}

  onSubmit(): void {
  if (this.productForm.invalid || !this.selectedFile) {
    alert('Lütfen tüm alanları ve resmi doldurun.');
    return;
  }

  const formData = new FormData();

  const product = {
    ...this.productForm.value,
    status: 'PENDING',
    rating: 0
  };

  formData.append('product', new Blob(
    [JSON.stringify(product)],
    { type: 'application/json' }
  ));
  formData.append('image', this.selectedFile);

  this.productService.addProduct(formData).subscribe({
    next: () => {
      alert('Ürün başarıyla eklendi!');
      this.router.navigate(['/seller/dashboard']);
    },
    error: err => {
      console.error('Ürün ekleme hatası', err);
      alert(`Hata! ${err.status} - ${err.message}`);
    }
  });
}

}
