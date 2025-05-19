import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { ConfirmPaymentComponent } from './confirm-payment/confirm-payment.component';

const routes: Routes = [
  { path: '', component: PaymentComponent,
    children:[
      {path:'confirm-payment',component:ConfirmPaymentComponent}
    ]
   }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
