import { Component, OnInit } from '@angular/core';
import { SellerService } from '../../core/services/seller.service';
import { Product } from '../../products/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-products',
  standalone:false,
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css']
})
export class MyProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';

  constructor(
    private sellerService: SellerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sellerService.getMyProducts().subscribe({
      next: prods => {
        console.log('Satıcı ürünleri geldi:', prods);
        this.products = prods;
        this.loading = false;
      },
      error: err => {
        console.error('Satıcı ürünleri yüklenemedi', err);
        this.error = 'Ürünler yüklenirken hata oluştu.';
        this.loading = false;
      }
    });
  }

  onEdit(id: number) {
    this.router.navigate(['/seller/my-products', id, 'edit']);
  }
  onDelete(id: number): void {
  if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
    this.sellerService.deleteProduct(id).subscribe({
      next: () => {
        alert('Product silindi.');
        this.products = this.products.filter(p => p.id !== id);
      },
      error: err => {
        console.error('Silme hatası:', err);
        alert('Silinirken hata oluştu.');
      }
    });
  }
}
}
