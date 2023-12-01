import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { UserComponent } from './dashboards/user/user.component';
import { AdminComponent } from './dashboards/admin/admin.component';
import { SingupComponent } from './auth/singup/singup.component';
import { LoginComponent } from './auth/login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CustomersComponent } from './customers/customers.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


const routes: Routes = [
  {path: "", pathMatch: 'full', redirectTo: ""},
  {path: "", component:LandingComponent},
  {path: "sign", component:SingupComponent},
  {path: "login", component:LoginComponent},
  {path: "user", component:UserComponent},
  {path: "customer", component:CustomersComponent},
  {path: "admin", component:AdminComponent},
  {path: "forgot", component:ForgotPasswordComponent},
  {path: "reset", component:ResetPasswordComponent},
  {path: "**", component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
