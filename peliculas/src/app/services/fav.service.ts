import { HttpClient } from "@angular/common/http";
import { Observable, of, from } from "rxjs";
import { Injectable } from "@angular/core";
import { map, switchMap, concatMap, toArray, catchError } from 'rxjs/operators';
import { Film } from "../pelis/interfaces/film.interface";
import { environments } from "src/app/environments/environment";
import { CommonService } from "./common.service";
import { Usuario } from "../pelis/interfaces/usuario.interface";
import { UsuarioService } from './usuario.service';


@Injectable({ providedIn: 'root' })
export class FavService {

    constructor(private http: HttpClient, private commonService: CommonService, private usuarioService: UsuarioService) {}

    // Obtener todas las películas favoritas de un usuario desde la API de TMDB
    getAllFavs(sessionId: string, accountId: string): Observable<Film[]> {//Aquí no hace falta un filmId
      const apiKey = localStorage.getItem('api_movies') || '';
        return this.http.get<{ results: any[] }>(
            `https://api.themoviedb.org/3/account/${accountId}/favorite/movies?api_key=${apiKey}&session_id=${sessionId}&language=es`
        ).pipe(
            map(response => response.results || [])
        );
    }

    // Añadir una película a favoritos en TMDB
    addFavorite(sessionId: string, accountId: string, filmId: number): Observable<any> {
      const apiKey = localStorage.getItem('api_movies') || '';
        return this.http.post(
            `https://api.themoviedb.org/3/account/${accountId}/favorite?api_key=${apiKey}&session_id=${sessionId}`,
            {
                media_type: "movie",
                media_id: filmId,
                favorite: true
            }
        ).pipe(
            catchError(error => {
                console.error('Error al añadir a favoritos:', error);
                return of(null);
            })
        );
    }

    // Eliminar una película de favoritos en TMDB
    removeFavorite(sessionId: string, accountId: string, filmId: number): Observable<any> {
      const apiKey = localStorage.getItem('api_movies') || '';
        return this.http.post(
            `https://api.themoviedb.org/3/account/${accountId}/favorite?api_key=${apiKey}&session_id=${sessionId}`,
            {
                media_type: "movie",
                media_id: filmId,
                favorite: false
            }
        ).pipe(
            catchError(error => {
                console.error('Error al eliminar de favoritos:', error);
                return of(null);
            })
        );
    }
}
