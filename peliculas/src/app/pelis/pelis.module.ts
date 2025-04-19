import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module'
import { ReactiveFormsModule } from '@angular/forms';

import { PelisRoutingModule } from './pelis-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { CardComponent } from './components/card/card.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { FavPageComponent } from './pages/fav-page/fav-page.component';
import { FilmPageComponent } from './pages/film-page/film-page.component';

import { FilmImagePipe } from './pipe/film-image.pipe';

import { UsuariosModule } from './pages/usuarios/usuarios.module';

@NgModule({
  declarations: [
    LayoutPageComponent,
    CardComponent,
    ConfirmDialogComponent,
    ListPageComponent,
    SearchPageComponent,
    FavPageComponent,
    FilmPageComponent,
    FilmImagePipe
  ],
  imports: [
    CommonModule,
    PelisRoutingModule,
    MaterialModule,
    UsuariosModule,
    ReactiveFormsModule
  ],
})
export class PelisModule { }
