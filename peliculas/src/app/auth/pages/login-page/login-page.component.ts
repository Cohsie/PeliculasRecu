import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterComponent } from '../../components/register/register.component';
import { NoUserComponent } from '../../components/no-user/no-user.component';



@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit{

  loginForm: FormGroup = new FormGroup({});

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private commonService: CommonService
  ){}

  ngOnInit(): void {
    this.setForm();
  }

  setForm(){
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required)
    })
    // console.log('sessionId:', localStorage.getItem('sessionId'));
    // console.log('accountId:', localStorage.getItem('account_id'));
    // console.log('token:', localStorage.getItem('token'));
    // console.log('usuario:', localStorage.getItem('usuario'));
    // console.log('api_movies antes de nada:', localStorage.getItem('api_movies'));
  }

  async acceso(){

    if(this.loginForm.valid){
      const username = this.loginForm.value.username;
      try{
        const userExiste = await this.authService.checkUser(username).toPromise();
        console.log(userExiste);
        if(userExiste){
          setTimeout(() => {//El delay que se pide
            const dialogRef = this.dialog.open(RegisterComponent, {
            width: '400px',
            data: { username }
          });

          dialogRef.afterClosed().subscribe(result => {//Después de cerrar este dialog tengo los datos del usuario y la contraseña(result)
            if (result) {
              this.doLogin(username, result);
            }
          });

          }, 500);

        }else {//Este es el dialog que debe abrirse cuando user no existe. Debe devolver al campo de usuario
          const dialogRef = this.dialog.open(NoUserComponent, {
            width: '400px'
          });
          dialogRef.afterClosed().subscribe(() => {//Tras cerrar este dialog, como el user no existe vuelve al login con el usuario vacío
            this.loginForm.get('username')?.setValue('');
          });

        }
      }catch(error){
        console.error('Error al verificar el usuario:', error);
        this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 5000 });
      }
    }
  }


  async doLogin(username: string, password: string){

    try {
      const data = { username, password };
      const RESPONSE = await this.authService.doLogin(data).toPromise();

      if (!RESPONSE || !RESPONSE.ok) {
        this.snackBar.open('Error en la respuesta del servidor', 'Cerrar', { duration: 5000 });
        return;
      }

      if (RESPONSE.data?.token) {//Si se ha obtenido el token sesion
        console.log('RESPONSE impreso: ',RESPONSE);
        console.log('RESPONSE token_sesion impreso: ',RESPONSE.data.token);

        localStorage.setItem('token', RESPONSE.data.token);
        console.log(localStorage.getItem('token'));

        localStorage.setItem('usuario', RESPONSE.data.usuario ?? '');//Esto es el correo. En todos los campos usuarios siempre va a haber un email porque ese campo tiene Validators.email
        localStorage.setItem('nombre_publico', RESPONSE.data.nombre_publico ?? '');
        localStorage.setItem('id_usuario', RESPONSE.data.id_usuario ?? '');
        localStorage.setItem('id_rol', RESPONSE.data.id_rol ?? '');
        localStorage.setItem('api_movies', RESPONSE.data.api_movies ?? '');
        localStorage.setItem('account_id', RESPONSE.data.account_id ?? '');
        this.commonService.headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESPONSE.data.token}`
        });

        console.log('Datos del usuario logueado:', {
          usuario: RESPONSE.data.usuario,
          id_usuario: RESPONSE.data.id_usuario,
          api_movies: RESPONSE.data.api_movies,
          account_id: RESPONSE.data.account_id
        });

        if(!localStorage.getItem('api_movies')){
          this.snackBar.open('Este usuario no tiene datos asignados a una cuenta de TMDB', 'Cerrar', {duration: 5000})
        } else{
          const popup = window.open('https://www.themoviedb.org/logout', 'tmdbAuthPopup', 'width=500,height=600');

          const checkClosed = setInterval(() => {
            if (popup?.closed) {
              clearInterval(checkClosed);
              console.log('El usuario cerró la ventana o terminó el flujo');

              this.authService.getRequestToken().subscribe({

                next:(tokenResponse) => {
                  console.log('Token recibido', tokenResponse);
                  const tokenR = tokenResponse.request_token;
                  localStorage.setItem('requestToken', tokenR);
                  console.log('request token antes de validar: ', tokenR);

                  const backURL = encodeURIComponent('http://localhost:4200/films');
                  const redirectURL = `https://www.themoviedb.org/authenticate/${tokenR}?redirect_to=${backURL}`


                  window.location.href = redirectURL;

                },
                error: (error) => {
                  console.error('Error al obtener el request token: ', error);
                  this.snackBar.open('Error al obtener el request token', 'Cerrar', { duration: 5000 });
                  this.authService.doLogout();//Si se quita esto se puede comprobar el error de búsqueda
                }
              });
            }
          }, 500);

        }
      } else if (RESPONSE.data?.valido === 0) {//Si no se ha obtenido el token y el usuario no es válido...
        this.snackBar.open('Usuario inhabilitado', 'Cerrar', { duration: 5000 });
      } else if (RESPONSE.data?.valido === 1) {//Si no se ha obtenido el token y el usuario es válido...
        this.snackBar.open('Usuario o contraseña incorrectas', 'Cerrar', { duration: 5000 });
      }
    } catch (error) {
      console.error('Error en el login:', error);
      this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 5000 });
    }
  }

}
