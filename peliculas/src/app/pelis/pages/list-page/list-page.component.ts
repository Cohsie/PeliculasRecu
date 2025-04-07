import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FilmService } from 'src/app/services/film.service';
import { Film } from '../../interfaces/film.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [
  ]
})
export class ListPageComponent implements OnInit {

  films: Film[] = [];

  constructor(private authService: AuthService, private filmService: FilmService) {}

  ngOnInit(): void{
    //Como después de validar el token manualmente se nos redirige a esta ruta es aquí donde he decidido obtener el sessionId
    const response_token = localStorage.getItem('requestToken');
    const sessionId = localStorage.getItem('sessionId');

    if(response_token && !sessionId){
      this.authService.getSessionId().subscribe({
        next: (response) => {
          console.log('Session ID obtenido:', response);
          const sessionId = response.session_id;
          localStorage.setItem('sessionId', sessionId);
        },
        error: (error) => {
          console.error('Error al obtener el Session ID:', error);
        }
      });
    }

    this.filmService.getTopRatedFilms().subscribe((data) => {
      this.films = data;
      console.log(this.films);
    });
  }
}
