import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/pelis/interfaces/usuario.interface';
import { UsuarioService } from 'src/app/services/usuario.service';
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

async deleteUser() {
  try {
    const RESP = await this.servicioUsuario.deleteUsuario(this.usuario).toPromise();
    if (RESP && RESP.message) {
      this.snackBar.open(RESP.message, 'Cerrar', { duration: 5000 });
      this.dialogRef.close({ ok: RESP.ok, data: RESP.data });
    } else {
      this.snackBar.open('Hubo un problema al eliminar al usuario.', 'Cerrar',  { duration: 5000 });
    }
  } catch (error) {
    this.snackBar.open('Error al realizar la solicitud. Intenta más tarde.', 'Cerrar',  { duration: 5000 });
    console.error(error);
  }
}

onNoClick() {
  this.dialogRef.close({ok: false});
}

}
