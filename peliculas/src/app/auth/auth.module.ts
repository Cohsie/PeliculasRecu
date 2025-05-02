import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthComponent } from './auth.component';
import { NoUserComponent } from './components/no-user/no-user.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    LayoutPageComponent,
    LoginPageComponent,
    AuthComponent,
    NoUserComponent,
    RegisterComponent
  ],
  imports: [
    //CommonModule,
    AuthRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
