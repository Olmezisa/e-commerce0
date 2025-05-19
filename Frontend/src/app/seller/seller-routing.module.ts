import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { SellerComponent } from './seller.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { SellerRegisterComponent } from '../auth/seller-register/seller-register.component';
import { MyProductsComponent } from './my-products/my-products.component';
import { RoleGuard } from '../core/guards/role.guard';
import { AuthGuard } from '../core/guards/auth.guard';
import { EditProductComponent } from './edit-product/edit-product.component';
import { OrderManagementComponent } from './order-management/order-management.component';

const routes: Routes = [
  { path: '', component: SellerComponent,
    canActivate:[AuthGuard,RoleGuard],
    data:{roles:['SELLER']},

  children:[
    { path: 'dashboard', component:SellerDashboardComponent },
    { path: 'seller-register', component:SellerRegisterComponent },
    { path: 'add-products', component:AddProductsComponent },
    { path: 'my-products/:id/edit', component: EditProductComponent },
    { path: 'my-products',component:MyProductsComponent},
    { path: 'order-management',component:OrderManagementComponent},


    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
