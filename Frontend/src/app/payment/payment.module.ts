import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { ConfirmPaymentComponent } from './confirm-payment/confirm-payment.component';


@NgModule({
  declarations: [
    PaymentComponent,
    ConfirmPaymentComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule
  ]
})
export class PaymentModule { }
