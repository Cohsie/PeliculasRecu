import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environments } from "src/app/environments/environment";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { Film } from "../pelis/interfaces/film.interface";
import { Usuario } from "../pelis/interfaces/usuario.interface";
import { UsuarioService } from './usuario.service';

@Injectable({providedIn: 'root'})
export class FilmService {

    constructor(private http: HttpClient, private usuarioService: UsuarioService){}

    findFilms(query: string): Observable<any> {
        const apiKey = this.usuarioService.getApiKey();//Creo una constante apiKey
        const params = new HttpParams()
            .set('api_key', apiKey) // Aquí uso la constante que obtiene la API gracias al método
            .set('page', '1')
            .set('language', 'es-ES')
            .set('query', query)
            .set('include_adult', 'true');

            return this.http.get<{ results: Film[] }>(environments.apiUrl, { params }).pipe(
                map(response => response.results || [])
            );
    }

    getDetailsById(filmId: number): Observable<Film> {
      const apiKey = this.usuarioService.getApiKey();//Creo una constante apiKey
      return this.http.get<any>(`https://api.themoviedb.org/3/movie/${filmId}?api_key=${apiKey}&language=es`)
    }

    getFilmDetails(title: string): Observable<Film> {
      const apiKey = this.usuarioService.getApiKey();//Creo una constante apiKey
      const url = `${environments.apiUrl}?api_key${apiKey}&query=${title}&language=es-ES`;

      return this.http.get<any>(url)
        .pipe(map((response: any) => response.results[0]));
    }

    getTopRatedFilms(): Observable<Film[]> {
      const apiKey = this.usuarioService.getApiKey();//Creo una constante apiKey

      const params = new HttpParams()
        .set('api_key', apiKey)
        .set('page', '1')
        .set('language', 'es-ES');

      // Petición a TMDB para obtener las películas con mejor puntuación
      return this.http.get<{ results: Film[] }>(`https://api.themoviedb.org/3/movie/top_rated`, { params })
        .pipe(map(response => response.results || [])); // Extraemos solo las películas
    }
}
