import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { RouterModule } from '@angular/router';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    OrderManagementComponent,
    ProductManagementComponent,
    UserManagementComponent,
    CategoryManagementComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
