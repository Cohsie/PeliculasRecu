import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environments } from "src/app/environments/environment";
import { Injectable } from "@angular/core";
import { map, switchMap } from 'rxjs/operators';
import { Film } from "../pelis/interfaces/film.interface";
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

      const accessToken = localStorage.getItem('api_movies');
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
        map(response => response.results),
        //Después de obtener los datos del buscador obtenemos las películas favoritas del usuario
        switchMap(films =>//switchMap me permite encadenar la primera petición con esta que se va a hacer y trabajar con ambos resultados
          this.favService.getAllFavs(sessionId, accountId).pipe(
            map(favorites => {//Aquí están las películas favoritas del usuario
              const favoriteIds = favorites.map(f => f.id);//Aquí se extraen los ID de las películas favoritas

              let marked = films.map(film => ({//Al final marked se convierte en un film con los datos de la película y el añadido de isFavorite
                ...film,//Crea un nuevo objeto que tenga todo igual que film y le añade isFavorite
                isFavorite: favoriteIds.includes(film.id),//Se crea isFavorite y es true si el id de la película(film.id el id de las buscadas) está en favoriteIds
              }));

              console.log('Géneros seleccionados:', selectedGenres);
              //film es un alias para cada película de marked
              if (selectedGenres.length > 0) {//Si es mayor que 0 se filtran las películas por los géneros seleccionados
                marked = marked.filter(film => //Se hace un filtrado de film
                  film.genre_ids.some(genre => selectedGenres.includes(genre))
                );                //Si la pelicula coincide con al menos uno de los géneros seleccionados la muestra
              }

              if (favoriteFilter === 'SI') {//El filtro de favoritos. Como en marked se ha añadido la propiedad isFavorite se puede filtrar por ella
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

    //Método para acceder a los detalles de una película seleccionada
    getDetailsById(filmId: number): Observable<Film> {
      const apiKey = localStorage.getItem('api_movies'); // Obtener el Bearer token

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      });

      const params = new HttpParams()
      .set('language', 'es-ES');


      return this.http.get<Film>(`https://api.themoviedb.org/3/movie/${filmId}`, { headers, params });
    }

    //Método para obtener las películas de la ruta /list
    getTopRatedFilms(): Observable<Film[]> {//? HECHO
      const accessToken = localStorage.getItem('api_movies');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      });

      const params = new HttpParams()
        .set('page', '1')
        .set('language', 'es-ES');

      return this.http.get<{ results: Film[] }>(`https://api.themoviedb.org/3/movie/top_rated`, { headers, params })
        .pipe(map(response => response.results));
    }

    //Método para obtener todas las categiorías de películas para el buscador de triple filtro
    getCategories(): Observable<{ id: number, name: string }[]> {
      const accessToken = localStorage.getItem('api_movies');
      const url = `${this.urlBase}/genre/movie/list`;

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      });

      const params = new HttpParams()
        .set('language', 'es-ES');

      return this.http.get<{ genres: { id: number, name: string }[] }>(url, { headers, params })
        .pipe(map(response => response.genres));
    }

    getFilmImages(filmId: number): Observable<any> {
      const apiKey = localStorage.getItem('api_movies'); // Obtener el Bearer token
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
