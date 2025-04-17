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
      //sessionId = localStorage.getItem('sessionId'),//TODO: aquí darle valor a sessionId y accountId
      sessionId: string,
      accountId: string,
      favoriteFilter: 'SI' | 'NO' | 'TODAS' = 'TODAS',
      categoryIds: number[] = []
    ): Observable<Film[]> {

        const apiKey = localStorage.getItem('api_movies') || '';
        const params = new HttpParams()
            .set('api_key', apiKey) // Aquí uso la constante que obtiene la API gracias al método
            .set('page', '1')
            .set('language', 'es-ES')
            .set('query', query)
            .set('include_adult', 'true');
                                      //Queremos obtener unalista de películas
            return this.http.get<{ results: Film[] }>(environments.apiUrl, { params }).pipe(
                map(response => response.results || []),//de Film solo results

                switchMap(films =>            //TODO: Este cambio lo ha hecho copilot. Ver por qué.
                  this.favService.getAllFavs(sessionId || '', accountId).pipe(
                    map(favorites => {//De los favoritos reduce
                      const favoriteIds = favorites.map(f => f.id);

                      let marked = films.map(film => ({
                        ...film, isFavorite: favoriteIds.includes(film.id)
                      }));

                      if (favoriteFilter === 'SI') {
                        return marked.filter(f => f.isFavorite);
                      } else if (favoriteFilter === 'NO') {
                        return marked.filter(f => !f.isFavorite);
                      }

                      if (categoryIds.length > 0) {
                        marked = marked.filter(film =>
                          film.genres.some(genre => categoryIds.includes(genre.id))//Puede que haya errores. Si es así poner un ? a la derecha de genres
                        );
                      }

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
}
