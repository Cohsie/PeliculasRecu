import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CommonService } from './common.service';
import { map, Observable, of, catchError } from 'rxjs';
import { ApiResponse } from '../auth/interfaces/api-response';
import { URL_API } from '../environments/environment';
import { Usuario } from '../pelis/interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  constructor(private http: HttpClient, private cookieService: CookieService, private commonService: CommonService) {}

  //Usuario->Base de datos
  doLogin(data: any){
    const body = JSON.stringify(data);
    console.log(body); //mejor comentar esto porque mostrar usuario y CONTRASEÑA en consola estaría feíllo
    return this.http.post<ApiResponse>(`${URL_API}/login.php`, body);
  }

  public checkAuthentication(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if(!token){
      return of (false);
    }
    return this.http.post<ApiResponse>(`${URL_API}/check_password.php`, {token}, {headers: this.commonService.headers})
      .pipe(
          map(response => {
            console.log('Respuesta del backend:', response);
            return response.ok;
          }),
          catchError((error) => {
            console.error('Error de solicitud:', error);
            return of(false);
          })
      );
  }

  public checkUser(usuario: String): Observable<boolean>{
    if(!usuario){
      return of(false);
    }
    console.log(usuario);
    return this.http.post<ApiResponse>(`${URL_API}/check_user.php`, {usuario}, {headers: this.commonService.headers})
      .pipe(
        map(response => {
            console.log("Respuesta del backend:", response);
            return response.ok;
        }),
        catchError((error) => {
            console.error("Error de solicitud:", error);
            return of(false);
        })
      );
  }



  doLogout() {
    const body = new FormData();
    const usuario = localStorage.getItem('usuario') || '';
    body.append('user', usuario);
    this.deleteSession
    localStorage.clear();
    localStorage.removeItem('sessionId');
    localStorage.removeItem('account_id');
    localStorage.removeItem('requestToken');
    localStorage.removeItem('token');
    this.cookieService.deleteAll();

    console.log('sessionId:', localStorage.getItem('sessionId'));
    console.log('accountId:', localStorage.getItem('account_id'));
    console.log('token:', localStorage.getItem('token'));
    console.log('usuario:', localStorage.getItem('usuario'));

    window.location.href = '/auth';
    return this.http.post(`${URL_API}/logout.php`, body);
  }


  //Para obtener el request token
  getRequestToken(): Observable<any> {
    const apiMovies = localStorage.getItem('api_movies');
    return this.http.get(
      `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiMovies}`
    )
  }

  //Para obtener el session id una vez obtenido el request token
  getSessionId(): Observable<any>{
    const request_token = localStorage.getItem('requestToken');
    console.log(localStorage.getItem('requestToken'));
    const api_movies = localStorage.getItem('api_movies');
    return this.http.post(
      `https://api.themoviedb.org/3/authentication/session/new?api_key=${api_movies}`,
      { request_token }
    )
  }

  async deleteSession(sessionId: string) {
    const response = await fetch('https://api.themoviedb.org/3/authentication/session', {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGJmMmVmZDE2ODg4Y2Q5NzliN2JkMDg5NWMwMmU5MSIsIm5iZiI6MTc0NTI1ODE0MS4zMTEsInN1YiI6IjY4MDY4NjlkMzdhNzIyYjg4NjhhMjhmNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1wbo6kO6Ce6VqUoTzDIbqqvKonn94ObZVCsUInzYY6c',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ session_id: sessionId })
    });

    if (response.ok) {
      console.log('Sesión eliminada correctamente');
    } else {
      const errorData = await response.json();
      console.error('Error al eliminar sesión:', errorData);
    }
  }

}

