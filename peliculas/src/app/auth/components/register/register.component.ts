import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  password: string = '';

  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any //Creo que es para meter los datos de la contraseña en este dialog
  ){}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onLogin(){
    this.dialogRef.close(this.password);
  }

}
