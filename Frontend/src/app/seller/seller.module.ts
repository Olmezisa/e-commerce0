import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SellerRoutingModule } from './seller-routing.module';

import { SellerComponent } from './seller.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { SellerAnalyticsComponent } from './seller-analytics/seller-analytics.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { MyProductsComponent } from './my-products/my-products.component';
import { EditProductComponent } from './edit-product/edit-product.component';

import { VariantModule } from '../variant/variant.module';
import { NgChartsModule } from 'ng2-charts';
import { OrderManagementComponent } from './order-management/order-management.component';



@NgModule({
  declarations: [
    SellerComponent,
    SellerDashboardComponent,
    SellerAnalyticsComponent,
    AddProductsComponent,
    MyProductsComponent,
    EditProductComponent,
    OrderManagementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SellerRoutingModule,
    VariantModule,
    NgChartsModule
  ]
})
export class SellerModule {}
