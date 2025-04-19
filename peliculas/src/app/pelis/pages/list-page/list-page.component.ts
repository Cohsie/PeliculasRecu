import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FilmService } from 'src/app/services/film.service';
import { Film } from '../../interfaces/film.interface';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { MatDividerModule } from '@angular/material/divider';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [
  ]
})
export class ListPageComponent implements OnInit {

  films: Film[] = [];
  constructor(private authService: AuthService, private filmService: FilmService, private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit() {
    const response_token = localStorage.getItem('requestToken');
    const sessionId = localStorage.getItem('sessionId');

    // Cargar los usuarios antes de todo
    this.usuarioService.getAllUsuarios().subscribe({
      next: (response) => {
        // Almacenar los usuarios en el servicio
        this.usuarioService.usuarios = response.data;

        console.log('Usuarios cargados:', this.usuarioService.usuarios);

        // if (!response_token){
        //   this.authService.doLogout();
        // }

        // Si no tenemos sessionId, lo obtenemos
        if (!sessionId) {
          this.authService.getSessionId().subscribe({
            next: (response) => {
              console.log('Session ID obtenido:', response);
              const sessionId = response.session_id;
              localStorage.setItem('sessionId', sessionId);

              // Ahora que tenemos el sessionId y los usuarios, cargamos las películas
              this.cargarPeliculas();
            },
            error: (error) => {
              console.error('Error al obtener el Session ID:', error);
              // 🔐 Forzar logout si el token no es válido (posible denegación)
              this.authService.doLogout();
              this.router.navigate(['/auth']);
            }
          });
        } else {
          // Si ya tenemos el sessionId, simplemente cargamos las películas
          this.cargarPeliculas();
        }
      },
      error: (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    });
    console.log(localStorage.getItem('sessionId'));
  }

  // Método para cargar las películas
  cargarPeliculas() {
    this.filmService.getTopRatedFilms().subscribe((data) => {
      this.films = data;
      console.log(this.films);
    });
  }

}
