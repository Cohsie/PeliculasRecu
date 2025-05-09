import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CommonService } from './common.service';
import { map, Observable, of, catchError } from 'rxjs';
import { ApiResponse } from '../auth/interfaces/api-response';
import { URL_API } from '../environments/environment';

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
    const token = localStorage.getItem('token');//Al hacer login el token se obtiene en localStorage y se pone en la base de datos, por lo que la comprobación en el backend va a dar bien
    if(!token){
      return of (false);
    }
    return of (true);
    // return this.http.post<ApiResponse>(`${URL_API}/check_password.php`, {token}, {headers: this.commonService.headers})
    //   .pipe(
    //       map(response => {
    //         console.log('Respuesta del backend:', response);
    //         return response.ok;
    //       }),
    //       catchError((error) => {
    //         console.error('Error de solicitud:', error);
    //         return of(false);
    //       })
    //   );
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
    const apiKey = localStorage.getItem('api_movies'); // Obtener el Bearer token

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(
      `https://api.themoviedb.org/3/authentication/token/new`,
      { headers }
    );
  }

  //Para obtener el session id una vez obtenido el request token
  getSessionId(): Observable<any> {
    const requestToken = localStorage.getItem('requestToken'); // Obtener el request token
    const apiKey = localStorage.getItem('api_movies'); // Obtener el Bearer token

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(
      `https://api.themoviedb.org/3/authentication/session/new`,
      { request_token: requestToken },
      { headers }
    );
  }

  getAccountId(sessionId: string): Observable<any> {
    const apiKey = localStorage.getItem('api_movies');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(                //Deduce el account id a partir del sessionId
      `https://api.themoviedb.org/3/account?session_id=${sessionId}`,
      { headers }
    );
  }
}

