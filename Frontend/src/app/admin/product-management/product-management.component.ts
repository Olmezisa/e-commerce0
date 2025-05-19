import { Component, OnInit } from '@angular/core';
import { Product } from '../../products/models/product.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-management',
  standalone: false,
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit {
  allProducts: Product[] = [];
  pendingProducts: Product[] = [];
  loading = false;
  activeTab: 'ALL' | 'PENDING' = 'ALL';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchAllProducts();
    this.fetchPendingProducts();
  }
  fetchAllProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.loading = false;
      },
      error: (err) => {
        console.error('Tüm ürünler alınamadı', err);
        this.loading = false;
      }
    });
  }

  fetchPendingProducts() {
    this.loading = true;
    this.productService.getProducts('PENDING').subscribe({
      next: (products) => {
        this.pendingProducts = products;
        this.loading = false;
      },
      error: (err) => {
        console.error('Onay bekleyen ürünler alınamadı', err);
        this.loading = false;
      }
    });
  }

  approve(id: number) {
    this.productService.approveProduct(id).subscribe(() => {
      this.pendingProducts = this.pendingProducts.filter(p => p.id !== id);
    });
  }

reject(id: number) {
  this.productService.rejectProduct(id).subscribe(() => {
    this.pendingProducts = this.pendingProducts.filter(p => p.id !== id);

    this.allProducts = this.allProducts.map(p =>
      p.id === id
        ? { ...p, status: 'BANNED' as any }
        : p
    );
  });
}


  delete(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.allProducts = this.allProducts.filter(p => p.id !== id);
    });
  }

  switchTab(tab: 'ALL' | 'PENDING') {
    this.activeTab = tab;
  }
  unban(id: number) {
  this.productService.unbanProduct(id).subscribe(updatedProduct => {
    this.allProducts = this.allProducts.map(p =>
      p.id === id ? updatedProduct : p
    );

    this.allProducts = this.allProducts.map(p =>
  p.id === id ? updatedProduct : p
);

// Sadece ürün hala 'PENDING' ise listeye ekle
if (updatedProduct.status === 'PENDING') {
  this.pendingProducts = [
    updatedProduct,
    ...this.pendingProducts.filter(p => p.id !== id)
  ];
} else {
  this.pendingProducts = this.pendingProducts.filter(p => p.id !== id);
}

  });
}



}
