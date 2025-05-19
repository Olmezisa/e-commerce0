import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; //ngif ngfor ngclass ngstyle falan buradan geliyor
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductsRoutingModule } from './products-routing.module';

import { ProductService } from '../core/services/product.service';
import { ProductListPageComponent } from './product-list-page/product-list-page.component';
import { ProductsComponent } from './products.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { ReviewCardComponent } from './review-card/review-card.component';
import { ProductDetailPageComponent } from './product-detail-page/product-detail-page.component';
import { ProductComparePageComponent } from './product-compare-page/product-compare-page.component';
import { SharedModule } from '../shared/shared.module';
import { SearchPageComponent } from './search-page/search-page.component';
import { VariantListComponent } from '../variant/variant-list/variant-list.component';
import { VariantFormComponent } from '../variant/variant-form/variant-form.component';
import { VariantModule } from '../variant/variant.module';
import { HttpClientModule } from '@angular/common/http';
import { MatSpinner } from '@angular/material/progress-spinner';




@NgModule({
  declarations: [
    ProductListPageComponent,
    ProductsComponent,
    ReviewListComponent,
    ReviewCardComponent,
    ProductDetailPageComponent,
    ProductComparePageComponent,
    SearchPageComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductsRoutingModule,
    HttpClientModule,
    SharedModule,
    ReactiveFormsModule,
    VariantModule,
    MatSpinner

],
  providers: [
    ProductService,
  ],
  exports:[
    ProductListPageComponent,
  ]
})
export class ProductsModule { }
