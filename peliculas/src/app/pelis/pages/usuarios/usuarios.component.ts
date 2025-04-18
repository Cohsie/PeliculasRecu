import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddUsuarioComponent } from './add-usuario/add-usuario.component';
import { EditUsuarioComponent } from './edit-usuario/edit-usuario.component';
import { DeleteUsuarioComponent } from './delete-usuario/delete-usuario.component';
import { FormControl } from '@angular/forms';
import { Overlay } from '@angular/cdk/overlay';
import { Usuario } from '../../interfaces/usuario.interface';
import { MatSelectChange } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {

  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
                                                                                                  //Uso el campo acciones para poner el edit y el delete
  displayedColumns: string[] = ['id_usuario', 'usuario', 'nombre_publico', 'rol', 'habilitado', 'acciones'];

  constructor(private dialog: MatDialog, private servicioUsuarios: UsuarioService, private overlay: Overlay){}

  ngOnInit(): void {
      this.getUsuarios()
  }

  async getUsuarios(){
    const RESPONSE = await this.servicioUsuarios.getAllUsuarios().toPromise();

    console.log(RESPONSE)

    if(RESPONSE && RESPONSE.ok){
      this.servicioUsuarios.usuarios = RESPONSE.data as Usuario[];
      this.dataSource.data = this.servicioUsuarios.usuarios;
    }
  }

  async addUsuario() {
    const dialogRef = this.dialog.open(AddUsuarioComponent, { width: '500px', scrollStrategy: this.overlay.scrollStrategies.noop() });
    const RESP = await dialogRef.afterClosed().toPromise();
    if (RESP) {
      if (RESP.ok) {
        this.servicioUsuarios.usuarios.push(RESP.data);
        this.dataSource.data = this.servicioUsuarios.usuarios;
      }
    }
  }

  async editUsuario(usuario: Usuario) {
    const dialogRef = this.dialog.open(EditUsuarioComponent, {
      data: usuario,
      width: '500px',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    const RESP = await dialogRef.afterClosed().toPromise();
    if (RESP) {
      if (RESP.ok) {
        this.servicioUsuarios.updateUsuario(RESP.data);
        this.dataSource.data = this.servicioUsuarios.usuarios;
      }
    }
  }

  async deleteUsuario(usuario: Usuario) {
    const dialogRef = this.dialog.open(DeleteUsuarioComponent, { data: usuario, scrollStrategy: this.overlay.scrollStrategies.noop() });
    const RESP = await dialogRef.afterClosed().toPromise();
    if (RESP) {
      if (RESP.ok) {
        this.servicioUsuarios.removeUsuario(RESP.data);
        this.dataSource.data = this.servicioUsuarios.usuarios;
      }
    }
  }

  toggleHabilitado(usuario: Usuario): void {
    const nuevoValor = usuario.habilitado === '1' ? '0' : '1';

    this.servicioUsuarios.actualizarHabilitado(usuario.id_usuario, nuevoValor)
      .subscribe({
        next: () => usuario.habilitado = nuevoValor,
        error: err => console.error('Error al actualizar habilitado', err)
      });
  }

}
