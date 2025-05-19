// src/app/variant/variant.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { VariantListComponent } from './variant-list/variant-list.component';
import { VariantFormComponent } from './variant-form/variant-form.component';

@NgModule({
  declarations: [
    VariantListComponent,
    VariantFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    VariantListComponent,
    VariantFormComponent
  ]
})
export class VariantModule {}
