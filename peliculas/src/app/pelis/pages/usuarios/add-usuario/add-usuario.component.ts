import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Rol } from 'src/app/pelis/interfaces/rol.interface';
import { RolesService } from 'src/app/services/roles.service';
import { UsuarioService } from 'src/app/services/usuario.service';
@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.scss']
})
export class AddUsuarioComponent {
  usuarioForm!: FormGroup;
  roles!: Rol[];

  constructor(public dialogRef: MatDialogRef<AddUsuarioComponent>,
    private servicioRoles: RolesService,
    private servicioUsuario: UsuarioService,
    public snackBar: MatSnackBar
) { }

  ngOnInit() {

    this.usuarioForm = new FormGroup({
      usuario: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      id_rol: new FormControl(null, [Validators.required]),
      nombre_publico: new FormControl(null),
      observaciones: new FormControl(null),
      api_movies: new FormControl(null, [Validators.required]),
      account_id: new FormControl(null, [Validators.required])
    });

    this.getRoles();
  }

  async getRoles() {
    try {
      const RESPONSE = await this.servicioRoles.getAllRoles().toPromise();
      if (RESPONSE && RESPONSE.ok) {
        this.roles = RESPONSE.data as Rol[];
      }
    } catch (error) {
      console.error('Error al obtener los roles:', error);
    }
  }

  async confirmAdd() {
    if (this.usuarioForm.valid) {
      const usuario = this.usuarioForm.value;

      try {
        const RESP = await this.servicioUsuario.addUsuario(usuario).toPromise();
        if (RESP && RESP.ok) {
          this.snackBar.open(RESP.message || 'Operación exitosa', 'Cerrar', { duration: 5000 });
          this.dialogRef.close({ ok: RESP.ok, data: RESP.data });
          console.log({ok: RESP.ok, data: RESP.data});
        } else {
          this.snackBar.open(RESP?.message || 'Hubo un error', 'Cerrar', { duration: 5000 });
          console.log('Error al añadir');
          console.log(RESP)
        }
      } catch (error) {
        console.error('Error al agregar el usuario:', error);
        this.snackBar.open('Hubo un error al agregar el usuario', 'Cerrar', { duration: 5000 });
      }
    } else {
      this.snackBar.open('El formulario no es válido', 'Cerrar', { duration: 5000 });
    }
  }

  onNoClick(): void {
    this.dialogRef.close({ok: false});
  }
}
