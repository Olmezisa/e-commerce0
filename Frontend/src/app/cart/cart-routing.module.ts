// src/app/cart/cart-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CartComponent } from './cart.component';
import { CartListComponent } from './cart-list/cart-list.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [
  {
    path: '',
    component: CartComponent,
    children: [
      // boş path geldiğinde sepete yönlensin
      { path: '', redirectTo: 'cartlist', pathMatch: 'full' },
      { path: 'cartlist', component: CartListComponent },
      { path: 'checkout', component: CheckoutComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule {}
