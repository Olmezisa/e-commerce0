import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { ProductVariant } from '../../products/models/variant.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-variant-form',
  standalone: false,
  templateUrl: './variant-form.component.html',
  styleUrl: './variant-form.component.css'
})
export class VariantFormComponent implements OnChanges {
  @Input() productId!: number;
  @Input() variant?: ProductVariant;
  @Output() saved = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private svc: ProductService) {
    this.form = this.fb.group({
      sku:      ['', Validators.required],
      optionName:  ['', Validators.required],
      optionValue: ['', Validators.required],
      price:    [0, Validators.required],
      stock:    [0, Validators.required],
      imageUrl: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['variant'] && this.variant) {
      this.form.patchValue(this.variant);
    }
  }

  onSubmit() {
    if (this.variant) {
      this.svc.updateVariant(this.variant.id, this.form.value)
        .subscribe(() => this.saved.emit());
    } else {
      this.svc.createVariant(this.productId, this.form.value)
        .subscribe(() => this.saved.emit());
    }
  }
}
