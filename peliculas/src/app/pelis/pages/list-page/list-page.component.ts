import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FilmService } from 'src/app/services/film.service';
import { Film } from '../../interfaces/film.interface';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit {

  films: Film[] = [];
  constructor(private authService: AuthService, private filmService: FilmService, private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit() {
    const sessionId = localStorage.getItem('sessionId');

    // Si no tenemos sessionId, lo obtenemos
    if (!sessionId) {
      this.authService.getSessionId().subscribe({
        next: (response) => {
          console.log('Session ID obtenido:', response);
          const sessionId = response.session_id;
          localStorage.setItem('sessionId', sessionId);

          // Ahora que tenemos el sessionId, cargamos las películas
          this.verificarAccountId(sessionId);
          this.cargarPeliculas();


        },
        error: (error) => {
          console.error('Error al obtener el Session ID:', error);
          this.authService.doLogout();
          this.router.navigate(['/auth']);
        }
      });
    } else {
      this.verificarAccountId(sessionId);
      this.cargarPeliculas();
    }
  }

  // Método para cargar las películas
  cargarPeliculas() {
    this.filmService.getTopRatedFilms().subscribe((data) => {
      this.films = data;
      console.log(this.films);
    });
  }

  private verificarAccountId(sessionId: string): void {


    this.authService.getAccountId(sessionId).subscribe({
      next: (response) => {
        const accountIdAPI = response.id;
        const accountId = localStorage.getItem('account_id');

        if (accountIdAPI && accountId !== accountIdAPI.toString()) {
          console.warn('Account ID distinto. Cerrando sesión.');
          console.log(accountId);
          console.log(accountIdAPI);
          this.authService.doLogout();
          this.router.navigate(['/auth']);
        }
      },
      error: (error) => {
        console.error('Error al obtener el Account ID:', error);

        this.authService.doLogout();
        this.router.navigate(['/auth']);
      }
    });
  }

}
