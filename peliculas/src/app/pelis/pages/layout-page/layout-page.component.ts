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
          {label: 'Gestión de usuarios', icon:'group', url: './usuarios'}
        );
      }
  }

  public opcionesSidebar =[
    { label: 'Películas más valoradas', icon:'star', url: './list' },
    { label: 'Buscador de películas', icon:'search', url: './search' },
    { label: 'Películas favoritas', icon:'star', url: './favs' }
  ]

  onLogout():void {
    this.authService.doLogout();
    this.router.navigate(['/auth']);
  }


}
