import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, of, from } from "rxjs";
import { Injectable } from "@angular/core";
import { map, switchMap, concatMap, toArray, catchError, tap } from 'rxjs/operators';
import { Film } from "../pelis/interfaces/film.interface";
import { environments } from "src/app/environments/environment";
import { CommonService } from "./common.service";
import { Usuario } from "../pelis/interfaces/usuario.interface";
import { UsuarioService } from './usuario.service';


@Injectable({ providedIn: 'root' })
export class FavService {

    constructor(private http: HttpClient, private commonService: CommonService, private usuarioService: UsuarioService) {}

    // Obtener todas las películas favoritas de un usuario desde la API de TMDB
    getAllFavs(sessionId: string, accountId: string): Observable<Film[]> {
      console.log('SessionId endpoint:', sessionId);
      console.log('AccountId endpoint:', accountId);
      console.log(`sessionId: ${sessionId} accountId: ${accountId}`);

      const accessToken = localStorage.getItem('api_movies');
      const url = `https://api.themoviedb.org/3/account/${accountId}/favorite/movies`;

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      });

      const params = new HttpParams()
        .set('session_id', sessionId)
        .set('language', 'es');

      return this.http.get<{ results: any[] }>(url, { headers, params }).pipe(
        tap(response => {
          console.log('API response:', response);
          console.log(accountId);
          console.log(accessToken);
        }),
        map(response => response.results)
      );
    }

    // Añadir una película a favoritos en TMDB
    addFavorite(sessionId: string, accountId: string, filmId: number): Observable<any> {
      const accessToken = localStorage.getItem('api_movies');
      const url = `https://api.themoviedb.org/3/account/${accountId}/favorite`;

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      });

      const params = new HttpParams()
        .set('session_id', sessionId);

      const body = {
        media_type: "movie",
        media_id: filmId,
        favorite: true
      };

      return this.http.post(url, body, { headers, params }).pipe(
        catchError(error => {
          console.error('Error al añadir a favoritos:', error);
          return of(null);
        })
      );
    }

    // Eliminar una película de favoritos en TMDB
    removeFavorite(sessionId: string, accountId: string, filmId: number): Observable<any> {
      const accessToken = localStorage.getItem('api_movies');
      const url = `https://api.themoviedb.org/3/account/${accountId}/favorite`;

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      });

      const params = new HttpParams()
        .set('session_id', sessionId);

      const body = {
        media_type: "movie",
        media_id: filmId,
        favorite: false
      };

      return this.http.post(url, body, { headers, params }).pipe(
        catchError(error => {
          console.error('Error al eliminar de favoritos:', error);
          return of(null);
        })
      );
    }


}
