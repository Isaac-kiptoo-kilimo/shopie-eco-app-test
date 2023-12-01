import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SingupComponent } from './auth/singup/singup.component';
import { LoginComponent } from './auth/login/login.component';
import { NavbarComponent } from './navigation/navbar/navbar.component';
import { FooterComponent } from './navigation/footer/footer.component';
import { AdminComponent } from './dashboards/admin/admin.component';
import { UserComponent } from './dashboards/user/user.component';
import { LandingComponent } from './landing/landing.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UpdateProductComponent } from './update-product/update-product.component';
import { SearchPipe } from './pipes/search.pipe';
import { CustomersComponent } from './customers/customers.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    SingupComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    AdminComponent,
    UserComponent,
    LandingComponent,
    NotFoundComponent,
    UpdateProductComponent,
    SearchPipe,
    CustomersComponent,
    UpdateUserComponent,
    ForgotPasswordComponent,
    SingleProductComponent,
    ResetPasswordComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
