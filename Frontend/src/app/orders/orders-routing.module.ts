import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { OrderHistoryComponent } from './order-history/order-history.component';

const routes: Routes = [
  {   path: '', component: OrdersComponent,
    children:[
      {path:'my-orders',component:MyOrdersComponent,
        canActivate:[AuthGuard,RoleGuard],
      data:{roles:['BUYER']}
      },
      {path:'order-tracking/:id',component:OrderTrackingComponent,
        canActivate:[AuthGuard,RoleGuard],data:{roles:['SELLER','BUYER']}
      },
      {path:'order-history',component:OrderHistoryComponent,
        canActivate:[AuthGuard,RoleGuard],
      data:{roles:['BUYER']}
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }

    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
