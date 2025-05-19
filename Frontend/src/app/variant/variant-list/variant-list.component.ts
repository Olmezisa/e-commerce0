import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ProductVariant } from '../../products/models/variant.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-variant-list',
  standalone: false,
  templateUrl: './variant-list.component.html',
  styleUrl: './variant-list.component.css'
})
export class VariantListComponent implements OnChanges {
  @Input() productId!: number;
  @Output() edit = new EventEmitter<ProductVariant>();
  @Output() delete = new EventEmitter<number>();

  variants: ProductVariant[] = [];
  loading = false;

  constructor(private svc: ProductService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && this.productId != null) {
      this.load();
    }
  }

  load(): void {
    this.loading = true;
    this.svc.getVariants(this.productId).subscribe({
      next: list => {
        this.variants = list;
        this.loading = false;
      },
      error: () => {
        this.variants = [];
        this.loading = false;
      }
    });
  }

  onEdit(v: ProductVariant): void {
    this.edit.emit(v);
  }

  onDelete(id: number): void {
    this.delete.emit(id);
  }
}
