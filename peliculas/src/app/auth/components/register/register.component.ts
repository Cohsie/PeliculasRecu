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
    @Inject(MAT_DIALOG_DATA) public data: any //Para que el dialog pueda recibir datos
  ){}

  onNoClick(): void {
    this.dialogRef.close();//Cierra el dialog sin más
  }

  onLogin(){
    this.dialogRef.close(this.password);//Pasa el dato de la contraseña
  }

}
