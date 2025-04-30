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
import { AddUserComponent } from './components/add-user/add-user.component';

@NgModule({
  declarations: [
    LayoutPageComponent,
    LoginPageComponent,
    AuthComponent,
    NoUserComponent,
    RegisterComponent,
    AddUserComponent
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
