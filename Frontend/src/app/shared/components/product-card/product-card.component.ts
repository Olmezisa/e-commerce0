import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../products/models/product.model';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product; //kartta gösterilecek ürün bilgileri
  @Input() selected: boolean = false; //daha öne seçildiyse buton disabled olur
  @Input() canSelect: boolean = true; //seçim sınırı dolduysa seçim yapamazsın
  isWishlisted =false;

  @Output() viewDetails = new EventEmitter<number>();//view details butonuna tıkladığında event fırlatır
  @Output() selectCompare = new EventEmitter<Product>();//compare butonuna tıkladığında event fırlatır
  baseImageUrl = 'http://localhost:8080';

  constructor(private wishList:WishlistService){}

  onViewDetails(): void {
    this.viewDetails.emit(this.product.id);
  }

  onSelectCompare(): void {
    this.selectCompare.emit(this.product);
  }

  ngOnInit() {
    // İlk yüklemede durumu al
    this.isWishlisted = this.wishList.isInWishlist(this.product.id);
    // Wishlist güncellemelerini dinlemek istersen:
    this.wishList.items$.subscribe(list =>
      this.isWishlisted = list.some(p => p.id === this.product.id)
    );
  }
  onToggleWishlist() {
    this.wishList.toggle(this.product);
  }


}

