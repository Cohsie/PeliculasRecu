import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environments } from "src/app/environments/environment";
import { Injectable } from "@angular/core";
import { map, switchMap } from 'rxjs/operators';
import { Film } from "../pelis/interfaces/film.interface";
import { Usuario } from "../pelis/interfaces/usuario.interface";
import { UsuarioService } from './usuario.service';
import { FavService } from "./fav.service";

@Injectable({providedIn: 'root'})
export class FilmService {

    private urlBase = 'https://api.themoviedb.org/3';

    constructor(private http: HttpClient, private usuarioService: UsuarioService, private favService: FavService){}

    findFilms(
      query: string,
      sessionId: string,
      accountId: string,
      favoriteFilter: 'SI' | 'NO' | 'TODAS' = 'TODAS',
      selectedGenres: number[] = [],
    ): Observable<Film[]> {

      const accessToken = localStorage.getItem('api_movies') || '';
      const url = `https://api.themoviedb.org/3/search/movie`;

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      });

      const params = new HttpParams()
        .set('page', '1')
        .set('language', 'es-ES')
        .set('query', query)
        .set('include_adult', 'true');

      return this.http.get<{ results: Film[] }>(url, { headers, params }).pipe(
        map(response => response.results || []),
        switchMap(films =>
          this.favService.getAllFavs(sessionId, accountId).pipe(
            map(favorites => {
              const favoriteIds = favorites.map(f => f.id);

              let marked = films.map(film => ({
                ...film,
                isFavorite: favoriteIds.includes(film.id),
              }));

              console.log('Géneros seleccionados:', selectedGenres);

              if (selectedGenres.length > 0) {
                marked = marked.filter(film =>
                  film.genre_ids.some(genre => selectedGenres.includes(genre))
                );
              }

              if (favoriteFilter === 'SI') {
                return marked.filter(f => f.isFavorite);
              } else if (favoriteFilter === 'NO') {
                return marked.filter(f => !f.isFavorite);
              }

              return marked;
            })
          )
        )
      );
    }


    getDetailsById(filmId: number): Observable<Film> {
      const apiKey = localStorage.getItem('api_movies') || ''; // Obtener el Bearer token

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      });

      const params = new HttpParams()
      .set('language', 'es-ES');


      return this.http.get<Film>(`https://api.themoviedb.org/3/movie/${filmId}`, { headers, params });
    }

    //Método para acceder a los detalles de una película seleccionada
    getFilmDetails(title: string): Observable<Film> {
      const apiKey = localStorage.getItem('api_movies') || ''; // Obtener el Bearer token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      });

      const params = new HttpParams()
        .set('query', title)
        .set('language', 'es-ES');

      return this.http.get<any>(
        `https://api.themoviedb.org/3/search/movie`, // Usamos la URL de búsqueda
        { headers, params } // Los parámetros de búsqueda y los encabezados
      ).pipe(
        map(response => response.results[0]) // Extraemos el primer resultado
      );
    }

    //Método para obtener las películas de la ruta /list
    getTopRatedFilms(): Observable<Film[]> {//? HECHO
      const accessToken = localStorage.getItem('api_movies') || '';

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      });

      const params = new HttpParams()
        .set('page', '1')
        .set('language', 'es-ES');

      return this.http.get<{ results: Film[] }>(`https://api.themoviedb.org/3/movie/top_rated`, { headers, params })
        .pipe(map(response => response.results || []));
    }

    //Método para obtener todas las categiorías de películas para el buscador de triple filtro
    getCategories(): Observable<{ id: number, name: string }[]> {
      const accessToken = localStorage.getItem('api_movies') || '';
      const url = `${this.urlBase}/genre/movie/list`;

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      });

      const params = new HttpParams()
        .set('language', 'es-ES');

      return this.http.get<any>(url, { headers, params })
        .pipe(map(response => response.genres));
    }

    getFilmImages(filmId: number): Observable<any> {
      const apiKey = localStorage.getItem('api_movies') || ''; // Obtener el Bearer token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      });

      return this.http.get<any>(
        `https://api.themoviedb.org/3/movie/${filmId}/images`, // URL correcta para obtener las imágenes
        { headers }
      ).pipe(
        map(response => response.backdrops) // Extraemos solo los backdrops
      );
    }
}
