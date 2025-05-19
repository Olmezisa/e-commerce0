import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }        from './login/login.component';
import { RegisterComponent }     from './register/register.component';
import { AuthComponent } from './auth.component';
import { SellerRegisterComponent } from './seller-register/seller-register.component';

const routes: Routes = [{path: '',component:AuthComponent,
  children:[
  { path: '',redirectTo: 'login', pathMatch:'full'},
      { path: 'login',  component: LoginComponent },
      { path: 'signup', component: RegisterComponent },
      { path: 'seller-register', component: SellerRegisterComponent },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
