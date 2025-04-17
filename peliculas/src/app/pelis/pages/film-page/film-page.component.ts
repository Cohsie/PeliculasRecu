import { Component, OnInit } from '@angular/core';
import { FilmService } from 'src/app/services/film.service';
import { FavService } from 'src/app/services/fav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { Film } from '../../interfaces/film.interface';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-films-page',
  templateUrl: './film-page.component.html',
  styleUrls: []
})
export class FilmPageComponent implements OnInit {
  public film?: Film;
  public account_id = localStorage.getItem('account_id');
  //public userId = localStorage.getItem('id_usuario');
  public sessionId = localStorage.getItem('sessionId');



  public isFavorite: boolean = false;

  constructor(private filmService: FilmService,
    private favsService: FavService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ){}
  ngOnInit(): void {
    console.log(this.account_id);
    this.activatedRoute.params//emite los parametros de la ruta, en este caso los ID
    //pipe envuelve los operadores rxjs (como switchMap en este caso)
    //switchMap
      .pipe(switchMap(({id}) => this.filmService.getDetailsById(id)))
      .subscribe(film => {
        if (!film) {
          console.log('No se encontró la pelicula');
          this.router.navigate(['/films/list']);
          return;
        }

        console.log('Pelicula encontrada:', film);
        this.checkIfFavorite(film.id);
        this.film = film;

      });
      console.log('Film en detalle:', this.film);
  }

  checkIfFavorite(filmId: number): void {
    if (this.sessionId && this.account_id) {
      this.favsService.getAllFavs(this.sessionId, this.account_id).subscribe(
        (favorites: any[]) => {
          console.log("Esto es favorites:", favorites);
          console.log("ID de la película:", filmId);

          if (Array.isArray(favorites)) {
            const isFavorite = favorites.indexOf(filmId) !== -1;
            this.isFavorite = isFavorite;
            console.log("¿Es favorito?", isFavorite);
          }
        },
        error => {
          console.error('Error al verificar favoritos:', error);
        }
      );
    }
  }

  addToFavorites(): void {
    console.log('Account ID:', this.account_id);
    console.log('Film:', this.film);
    console.log('Session ID:', this.sessionId);

    if (this.account_id && this.film && this.sessionId) {
      const filmId = this.film.id;
      const filmTitle = this.film.title;

      this.favsService.addFavorite(this.sessionId, this.account_id, filmId).subscribe(
        () => {
          this.isFavorite = true;
          console.log('Película añadida a favoritos');
          this.showSnackbar(`${filmTitle} ha sido añadida a favoritos`);
          this.checkIfFavorite(filmId);
        },
        error => {
          console.error('Error al añadir a favoritos:', error);
        }
      );
    } else {
      console.error('Película no encontrada o usuario no válido');
    }
  }

  removeFromFavorites(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;

      if (this.account_id && this.film && this.sessionId) {
        const filmId = this.film.id;
        const filmTitle = this.film.title;

        this.favsService.removeFavorite(this.sessionId, this.account_id, filmId).subscribe(
          () => {
            this.isFavorite = false;
            console.log('Película eliminada de favoritos');
            this.checkIfFavorite(filmId);
            this.showSnackbar(`${filmTitle} ha sido eliminada de favoritos`);
          },
          error => {
            console.error('Error al eliminar de favoritos:', error);
          }
        );
      }
    })
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }


  goBack(): void {
    this.router.navigate(['/films/search']);
  }
}
