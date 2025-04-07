import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FavPageComponent } from './pelis/pages/fav-page/fav-page.component';
import { FilmPageComponent } from './pelis/pages/film-page/film-page.component';
import { SearchPageComponent } from './pelis/pages/search-page/search-page.component';
import { ListPageComponent } from './pelis/pages/list-page/list-page.component';
import { UsuariosComponent } from './pelis/pages/usuarios/usuarios.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
