import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Imports de todos los componentes del page pelis
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { FilmPageComponent } from './pages/film-page/film-page.component';
import { FavPageComponent } from './pages/fav-page/fav-page.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';


const routes: Routes = [
  {
    //Ruta padre
    path: '', component: LayoutPageComponent,

    children: [
      {path: 'search', component: SearchPageComponent},
      {path: 'list', component: ListPageComponent},
      {path: 'favs', component: FavPageComponent},
      {path: 'usuarios', component: UsuariosComponent},
      {path: ':id', component: FilmPageComponent},
      {path: '**', redirectTo: 'list'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PelisRoutingModule { }
