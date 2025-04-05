import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  tokenPasswd: string = '';
  formularioRecuperacion = false;
  formularioReseteo = false;
  checkTokenPasswd = false;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ){
    this.activatedRoute.queryParams.subscribe(params => {
      this.tokenPasswd = params['token'];
    });

    if (this.tokenPasswd){
      this.formularioReseteo = true;
      this.checkPassToken(this.tokenPasswd);
    }
  }

  ngOnInit(): void {

  }

  forgotPassword(event: boolean) {
    this.formularioRecuperacion = event;
  }

  resetPass(event: boolean) {
    this.formularioReseteo = event;
  }

  checkPassToken(tokenPasswd: string) {
    this.authService.checkPassToken(tokenPasswd).subscribe(data => {
        this.checkTokenPasswd = data.ok;
    });
  }

}
