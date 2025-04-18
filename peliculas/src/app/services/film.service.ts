import { HttpClient, HttpParams } from "@angular/common/http";
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
      selectedGenres: number[] = [],//Esto sí que debe estar para poder pillar los géneros seleccionados
    ): Observable<Film[]> {

      const apiKey = localStorage.getItem('api_movies') || '';
      const params = new HttpParams()
        .set('api_key', apiKey)
        .set('page', '1')
        .set('language', 'es-ES')
        .set('query', query)
        .set('include_adult', 'true');

      return this.http.get<{ results: Film[] }>(environments.apiUrl, { params }).pipe(
        map(response => response.results || []),
        switchMap(films =>
          this.favService.getAllFavs(sessionId, accountId).pipe(
            map(favorites => {
              const favoriteIds = favorites.map(f => f.id);
                                    //favorites es el array de favoritas. f recorre el array y extrae el id
              let marked = films.map(film => {//transforma lo obtenido con switchMap para agregarle la propiedad isFavorite
                return {
                  ...film, //Creo una copia de cada objeto film
                  isFavorite: favoriteIds.includes(film.id), //y le agrego la propiedad isFavorite
                };
              });

              console.log('Géneros seleccionados: ', selectedGenres)//Me lo pilla

              // Filtrado de acuerdo a los géneros seleccionados
              if (selectedGenres.length > 0) {
                marked = marked.filter(film => {
                  console.log(film.genre_ids);
                  return film.genre_ids.some(genre => selectedGenres.includes(genre)); //Con every sería que coincida todo. Con some que coincidan algunos
                });
              }

              if (favoriteFilter === 'SI') {
                return marked.filter(f => f.isFavorite);//Las que son favoritas
              } else if (favoriteFilter === 'NO') {
                return marked.filter(f => !f.isFavorite);//Las que no lo son
              }

              // console.log(films);
              // console.log(marked);
              return marked;


            })
          )
        )
      );
    }


    getDetailsById(filmId: number): Observable<Film> {
      const apiKey = localStorage.getItem('api_movies') || '';
      return this.http.get<any>(`https://api.themoviedb.org/3/movie/${filmId}?api_key=${apiKey}&language=es`)
    }

    //Método para acceder a los detalles de una película seleccionada
    getFilmDetails(title: string): Observable<Film> {
      const apiKey = localStorage.getItem('api_movies') || '';
      const url = `${environments.apiUrl}?api_key${apiKey}&query=${title}&language=es-ES`;

      return this.http.get<any>(url)
        .pipe(map((response: any) => response.results[0]));
    }

    //Método para obtener las películas de la ruta /list
    getTopRatedFilms(): Observable<Film[]> {
      const apiKey = localStorage.getItem('api_movies') || '';

      //const apiKey = this.usuarioService.getApiKey();//Creo una constante apiKey
      //console.log('API Key usada:', this.usuarioService.getApiKey());

      const params = new HttpParams()
        .set('api_key', apiKey)
        .set('page', '1')
        .set('language', 'es-ES');

      // Petición a TMDB para obtener las películas con mejor puntuación
      return this.http.get<{ results: Film[] }>(`https://api.themoviedb.org/3/movie/top_rated`, { params })
        .pipe(map(response => response.results || [])); // Extraemos solo las películas
    }

    //Método para obtener todas las categiorías de películas para el buscador de triple filtro
    getCategories(): Observable<{id:number, name:string}[]>{
      const apiKey = localStorage.getItem('api_movies') || '';
      const url = `${this.urlBase}/genre/movie/list?api_key=${apiKey}&language=es-ES`;

      return this.http.get<any>(url)
        .pipe(map(response => response.genres));

    }

    getFilmImages(filmId: number): Observable<any>{//Para las varias imágenes
      const apiKey = localStorage.getItem('api_movies') || '';
      const url = `https://api.themoviedb.org/3/movie/${filmId}/images?api_key=${apiKey}`;

      return this.http.get<any>(url).pipe(
        map(response => response.backdrops) // Aseguramos que solo devolvemos los backdrops
      );
    }
}
