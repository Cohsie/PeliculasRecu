import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_API, URL_BASE } from 'src/app/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { CommonService } from './common.service';
import { Usuario } from '../pelis/interfaces/usuario.interface';
import { ApiResponse } from '../auth/interfaces/api-response';

const ENDPOINT = 'usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarios: Usuario[] = [];

  constructor(private http: HttpClient, private commonService: CommonService, private cookieService: CookieService) {
  }

  getAllUsuarios() {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, { headers: this.commonService.headers });
  }

  addUsuario(usuario: Usuario) {
    const body = JSON.stringify(usuario);
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, {headers: this.commonService.headers });
  }

  editUsuario(usuario: Usuario, route?: string) {
    const body = JSON.stringify(usuario);

    if (route) {
      route = `?route=${route}`;
    } else {
      route = '';
    }

    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php${route}`, body, { headers: this.commonService.headers });
  }

  deleteUsuario(usuario: Usuario) {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${usuario.id_usuario}`, { headers: this.commonService.headers });
  }

  removeUsuario(idUser: number) {
    this.usuarios = this.usuarios.filter(usuario => {
      return Number(usuario.id_usuario) !== Number(idUser);
    });
  }

  updateUsuario(usuario: Usuario) {
    let index = null;
    this.usuarios.filter((usuarioFilter, indexFilter) => {
      if (usuario.id_usuario === usuarioFilter.id_usuario) {
        index = indexFilter;
      }
    });

    if (index) {
      this.usuarios[index] = usuario;
    }
  }

  //Métodos que se usarán para mostrar las películas utilizando la API key del usuario
  getUsuarioActual(): Usuario | null {
    console.log('Usuarios cargados:', this.usuarios);

    const idUsuario = localStorage.getItem('id_usuario');
    console.log('LocalStorage id_usuario:', idUsuario);
    if (!idUsuario) {
      return null;
    }
    return this.usuarios.find(usuario => usuario.id_usuario.toString() === idUsuario) || null;
  }

  // getApiKey(): string {
  //   console.log(this.getUsuarioActual);
  //   const usuarioActual = this.getUsuarioActual();
  //   if (!usuarioActual) {
  //     throw new Error('Usuario actual no definido');
  //   }
  //   return usuarioActual.api_movies; // Retornar la API key del usuario actual
  // }
}
