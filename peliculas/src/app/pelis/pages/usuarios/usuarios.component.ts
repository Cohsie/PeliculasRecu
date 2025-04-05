import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddUsuarioComponent } from './add-usuario/add-usuario.component';
import { EditUsuarioComponent } from './edit-usuario/edit-usuario.component';
import { DeleteUsuarioComponent } from './delete-usuario/delete-usuario.component';
import { FormControl } from '@angular/forms';
import { Overlay } from '@angular/cdk/overlay';
import { Usuario } from '../../interfaces/usuario.interface';
import { Permises } from 'src/app/auth/interfaces/api-response';
import { MatSelectChange } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();

  idFilter = new FormControl('');
  usuarioFilter = new FormControl('');
  nombreFilter = new FormControl('');
  rolFilter = new FormControl('');

  usuarios!: Usuario;
  permises!: Permises;
  selection!: SelectionModel<Usuario>;

  displayedColumns!: string[];
  private filterValues = {
    id_usuario: '',
    usuario: '',
    nombre_publico: '',
    rol: '',
    habilitado: 0
  };


  constructor(
              public dialog: MatDialog,
              private servicioUsuarios: UsuarioService,
              private overlay: Overlay
              ) { }

  ngOnInit() {
    this.getUsuarios();
  }

  async getUsuarios() {
    const RESPONSE = await this.servicioUsuarios.getAllUsuarios().toPromise();
    if (RESPONSE && RESPONSE.permises) {
      console.log(RESPONSE);

      this.permises = RESPONSE.permises;
      this.displayedColumns = ['id_usuario', 'usuario', 'nombre_publico', 'rol', 'habilitado', 'actions'];
      this.servicioUsuarios.usuarios = RESPONSE!.data as Usuario[];
      this.dataSource.data = this.servicioUsuarios.usuarios;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.createFilter();
      this.selection = new SelectionModel<Usuario>(false, [this.usuarios])
      this.onChanges();
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

  //Filtro de búsqueda de usuario
  createFilter(): (usuario: any, filter: string) => boolean {
    const filterFunction = (usuario: any, filter: string): boolean => {
        const searchTerms = JSON.parse(filter);

        return usuario.id_usuario.toString().indexOf(searchTerms.id_usuario.toLowerCase()) !== -1
            && usuario.usuario.toLowerCase().indexOf(searchTerms.usuario.toLowerCase()) !== -1
            && usuario.nombre_publico.toLowerCase().indexOf(searchTerms.nombre_publico.toLowerCase()) !== -1
            && usuario.rol.toLowerCase().indexOf(searchTerms.rol.toLowerCase()) !== -1
            && (searchTerms.habilitado === 'todos' || usuario.habilitado === searchTerms.habilitado);
    };

    return filterFunction;
  }

  onChanges(): void {
    this.idFilter.valueChanges
        .subscribe(value => {
            this.filterValues.id_usuario = value ?? '';
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });

    this.usuarioFilter.valueChanges
        .subscribe(value => {
            this.filterValues.usuario = value ?? '';
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });

    this.nombreFilter.valueChanges
        .subscribe(value => {
            this.filterValues.nombre_publico = value ?? '';
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });

    this.rolFilter.valueChanges
      .subscribe(value => {
          this.filterValues.rol = value ?? '';
          this.dataSource.filter = JSON.stringify(this.filterValues);
      });

    }

    //Para cambiar el valor del campo "habilitado"
    buscarHabilitados(event: MatSelectChange) {

      let value: number;

      if (event.value === 'todos') {
        value = event.value;
      } else {
        value = Number(event.value);
      }

      this.filterValues.habilitado = value;

      this.dataSource.filter = JSON.stringify(this.filterValues);
    }
}
