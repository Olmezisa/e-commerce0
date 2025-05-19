
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: '',          redirectTo: 'home', pathMatch: 'full' },

  // auth
  { path: 'auth',     loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  //{ path: 'signup',    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },

  // home, products, cart vb. zaten lazy load
  { path: 'home',      loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'products',  loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
  { path: 'cart',      loadChildren: () => import('./cart/cart.module').then(m => m.CartModule) },
  { path: 'orders',    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule) },
  { path: 'wishlist',  loadChildren: () => import('./wishlist/wishlist.module').then(m => m.WishlistModule) },
  { path: 'account',   loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  { path:'search', loadChildren:() => import('./products/products.module').then(m=>m.ProductsModule)},
  { path: 'seller', loadChildren: () => import('./seller/seller.module').then(m => m.SellerModule) },
  { path: 'payment', loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule) },

  { path: '**',        redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
