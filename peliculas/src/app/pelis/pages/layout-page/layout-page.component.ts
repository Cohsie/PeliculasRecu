import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: [
  ]
})

//Este es el component del sidenav
export class LayoutPageComponent implements OnInit{

  constructor(private authService: AuthService,
    private router: Router
  ){}
  //Obtengo el rol del usuario
  public rol = localStorage.getItem('id_rol');

  ngOnInit(): void {
      if(this.rol == '1'){
        this.opcionesSidebar.push(
          {label: 'Gestión de usuarios', url: './usuarios'}
        );
      }
  }


  public opcionesSidebar =[
    { label:'Películas más valoradas', url: './list' },
    { label: 'Buscador de películas', url: './search' },
    { label: 'Películas favoritas', url: './favs' }
  ]




}
