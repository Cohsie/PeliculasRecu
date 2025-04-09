import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterComponent } from '../../components/register/register.component';
import { NoUserComponent } from '../../components/no-user/no-user.component';
import { AddUserComponent } from '../../components/add-user/add-user.component';
import { Overlay } from '@angular/cdk/overlay';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from '../../../pelis/interfaces/usuario.interface';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit{

  @Output() valueChange = new EventEmitter();

  loginForm: FormGroup = new FormGroup({});

  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();


  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private overlay: Overlay,
    private servicioUsuarios: UsuarioService,
    private commonService: CommonService
  ){}

  ngOnInit(): void {
    this.setForm();
  }

  setForm(){
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required)
    })
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

  //Esto es temporal para poder añadir un usuario admin con la apiKey
  async registro() {
    const dialogRef = this.dialog.open(AddUserComponent, { width: '500px', scrollStrategy: this.overlay.scrollStrategies.noop() });
    const RESP = await dialogRef.afterClosed().toPromise();
    if (RESP) {
      if (RESP.ok) {
        this.servicioUsuarios.usuarios.push(RESP.data);
        this.dataSource.data = this.servicioUsuarios.usuarios;
      }
    }
  }


  //TODO: Tengo que controlar el caso en el que el usuario tenga token pero no un session_id
  async doLogin(username: string, password: string){
    try {
      const data = { username, password };
      const RESPONSE = await this.authService.doLogin(data).toPromise();

      if (!RESPONSE || !RESPONSE.ok) {
        this.snackBar.open('Error en la respuesta del servidor', 'Cerrar', { duration: 5000 });
        return;
      }

      if (RESPONSE.data?.token) {
        localStorage.setItem('token', RESPONSE.data.token);
        localStorage.setItem('usuario', RESPONSE.data.usuario ?? '');//Esto es el correo. En todos los campos usuarios siempre va a haber un email porque ese campo tiene Validators.email
        localStorage.setItem('nombre_publico', RESPONSE.data.nombre_publico ?? '');
        //Dejo estas dos porque parece que se usan en el backend
        //!! PUEDE QUE ESTO NO HAYA QUE PONERLO
        // localStorage.setItem('ultimaOpcion', RESPONSE.data.opcion ?? '');
        // localStorage.setItem('ultimoGrupo', RESPONSE.data.grupo ?? '');

        localStorage.setItem('id_usuario', RESPONSE.data.id_usuario ?? '');
        localStorage.setItem('id_rol', RESPONSE.data.id_rol ?? '');
        localStorage.setItem('api_movies', RESPONSE.data.api_movies ?? '');
        localStorage.setItem('account_id', RESPONSE.data.account_id ?? '');
        this.commonService.headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESPONSE.data.token}`
        });

        if(!localStorage.getItem('api_movies')){
          this.snackBar.open('Este usuario no tiene datos asignados a una cuenta de TMDB', 'Cerrar', {duration: 5000})
        } else{
          //Obtener el request_token
          this.authService.getRequestToken().subscribe({
            next:(tokenResponse) => {
              console.log('Token recibido', tokenResponse);
              localStorage.setItem('requestToken', tokenResponse);

              const backURL = encodeURIComponent('http://localhost:4200/pelis');
              const redirectURL = `https://www.themoviedb.org/authenticate/${tokenResponse}?redirect_to=${backURL}`

              window.location.href = redirectURL;

            },
            error: (error) => {
              console.error('Error al obtener el request token: ', error);
            }
          });
        }
        this.router.navigate([`/pelis`]);
      } else if (RESPONSE.data?.valido === 0) {
        this.snackBar.open('Usuario inhabilitado', 'Cerrar', { duration: 5000 });
      } else if (RESPONSE.data?.valido === 1) {
        this.snackBar.open('Usuario o contraseña incorrectas', 'Cerrar', { duration: 5000 });
      }
    } catch (error) {
      console.error('Error en el login:', error);
      this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 5000 });
    }
  }

}
