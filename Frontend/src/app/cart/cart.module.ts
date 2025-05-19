import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartRoutingModule } from './cart-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CartListComponent } from './cart-list/cart-list.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartComponent } from './cart.component';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    CartListComponent,
    CheckoutComponent,
    CartComponent,
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    ReactiveFormsModule,
    SharedModule
]
})
export class CartModule { }
