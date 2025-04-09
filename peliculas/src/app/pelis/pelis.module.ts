import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module'

import { PelisRoutingModule } from './pelis-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { CardComponent } from './components/card/card.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ListPageComponent } from './pages/list-page/list-page.component';

import { UsuariosModule } from './pages/usuarios/usuarios.module';

@NgModule({
  declarations: [
    LayoutPageComponent,
    CardComponent,
    ConfirmDialogComponent,
    ListPageComponent
  ],
  imports: [
    CommonModule,
    PelisRoutingModule,
    MaterialModule,
    UsuariosModule
  ],
})
export class PelisModule { }
