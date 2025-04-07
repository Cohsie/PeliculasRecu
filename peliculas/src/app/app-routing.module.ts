import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './shared/pages/error404/error404.component';
import { CanActivateGuard, CanMatchGuard } from './auth/guards/auth.guard';
import { PublicGuard } from './auth/guards/public.guard';
//TODO: Tengo que mirar lo del guard


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m=>m.AuthModule),
    canActivate: [PublicGuard],
  },
  {
    path: 'films',
    loadChildren: () => import('./pelis/pelis.module').then(m=>m.PelisModule),
    canMatch: [CanMatchGuard],
    canActivate: [CanActivateGuard],
  },
  {
    path: '404',
    component: Error404Component,
  },
  {
    path: '',
    redirectTo: 'films',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: Error404Component,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
