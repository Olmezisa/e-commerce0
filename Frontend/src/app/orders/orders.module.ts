import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [
    OrdersComponent,
    OrderHistoryComponent,
    OrderTrackingComponent,
    MyOrdersComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
  ]
})
export class OrdersModule { }
