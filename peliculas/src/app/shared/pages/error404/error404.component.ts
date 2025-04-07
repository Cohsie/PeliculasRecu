import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styles: [
  ]
})
export class Error404Component {
  constructor(private router: Router){}

  goToLogin(){
    this.router.navigate(['/auth']);
  }
}
