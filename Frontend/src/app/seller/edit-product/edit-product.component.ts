import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../products/models/product.model';
import { ProductVariant } from '../../products/models/variant.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VariantListComponent } from '../../variant/variant-list/variant-list.component';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-edit-product',
  standalone: false,
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  product!: Product;
  variants: ProductVariant[] = [];
  editingVariant?: ProductVariant;
  productForm!: FormGroup;
  categories: Category[] = [];

  @ViewChild(VariantListComponent) variantListComponent!: VariantListComponent;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private svc: ProductService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/seller/my-products']);
      return;
    }

    this.productForm = this.fb.group({
      name:        ['', Validators.required],
      description: [''],
      price:       [0, [Validators.required, Validators.min(0)]],
      stock:       [0, [Validators.required, Validators.min(0)]],
      imageUrl:    [''],
      status:      ['', Validators.required],
      categoryId:  [null, Validators.required]
    });

    this.categoryService.getAllCategories().subscribe({
      next: cats => this.categories = cats
    });

    this.svc.getProductById(id).subscribe(p => {
      this.product = p;
      this.productForm.patchValue({
        name:        p.name,
        description: p.description,
        price:       p.price,
        stock:       p.stock,
        imageUrl:    p.imageUrl,
        status:      p.status,
        categoryId:  p.category?.id || null
      });
    });

    this.loadVariants(id);
  }

  loadVariants(productId: number): void {
    this.svc.getVariants(productId).subscribe(list => this.variants = list);
  }

  onProductSubmit(): void {
    if (this.productForm.invalid) return;

    const body = {
      name:        this.productForm.value.name,
      description: this.productForm.value.description,
      price:       this.productForm.value.price,
      stock:       this.productForm.value.stock,
      imageUrl:    this.productForm.value.imageUrl,
      status:      this.productForm.value.status,
      categoryId:  this.productForm.value.categoryId
    };

    this.svc.updateProduct(this.product.id, body).subscribe({
      next: () => alert('Ürün başarıyla güncellendi!'),
      error: err => {
        console.error('PUT hatası:', err);
        alert(`Güncelleme hatası: ${err.status} ${err.message}`);
      }
    });
  }

  onEditVariant(v: ProductVariant): void {
    this.editingVariant = v;
  }

  onDeleteVariant(id: number): void {
    this.svc.deleteVariant(id).subscribe(() => {
      this.variantListComponent.load();
    });
  }

  onVariantSaved(): void {
    this.editingVariant = undefined;
    this.variantListComponent.load();
  }
}
