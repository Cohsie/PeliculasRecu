import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/films/interfaces/usuario.interface';
import { UsuarioService } from 'src/app/films/services/usuario.service';
@Component({
  selector: 'app-delete-usuario',
  templateUrl: './delete-usuario.component.html',
  styleUrls: ['./delete-usuario.component.scss']
})
export class DeleteUsuarioComponent {

  constructor(public dialogRef: MatDialogRef<DeleteUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public usuario: Usuario,
    private servicioUsuario: UsuarioService,
    private snackBar: MatSnackBar
) { }

//No he puesto ngOnInit porque parece que no hace falta

async deleteUser() {

  const RESP = await this.servicioUsuario.deleteUsuario(this.usuario).toPromise();
  if (RESP.ok) {
    this.snackBar.open(RESP.message, 'Cerrar', { duration: 5000 });
    this.dialogRef.close({ok: RESP.ok, data: RESP.data});
  } else {
    this.snackBar.open(RESP.message, 'Cerrar', { duration: 5000 });
  }
}

onNoClick() {
  this.dialogRef.close({ok: false});
}

}
