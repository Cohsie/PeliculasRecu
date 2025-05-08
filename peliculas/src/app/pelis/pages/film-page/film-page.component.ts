import { Component, OnInit } from '@angular/core';
import { FilmService } from 'src/app/services/film.service';
import { FavService } from 'src/app/services/fav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Film } from '../../interfaces/film.interface';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-films-page',
  templateUrl: './film-page.component.html',
  styleUrls: ['./film-page.component.scss']
})
export class FilmPageComponent implements OnInit {
  public film?: Film; //Apunte para recordar que las propiedades de clase son public por defecto
  private accountId: string = localStorage.getItem('account_id') ?? '';
  private sessionId: string = localStorage.getItem('sessionId') ?? '';

  public filmImages: any[] = []; // Array para almacenar las imágenes de fondo (backdrops)


  public isFavorite: boolean = false;

  constructor(private filmService: FilmService,
    private favsService: FavService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ){}
  ngOnInit(): void {

    console.log('account_id del usuario',this.accountId);

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
        this.loadImages(film.id);

      });
      console.log('Film en detalle:', this.film);
  }

  checkIfFavorite(filmId: number): void {
    if (this.sessionId && this.accountId) {
      this.favsService.getAllFavs(this.sessionId, this.accountId).subscribe(//Primero obtiene todos los favoritos
        (favorites: any[]) => {
          if (Array.isArray(favorites)) {
            const isFavorite = favorites.some(fav => fav.id === filmId);
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

  //Añadir a favoritos
  addToFavorites(): void {
    console.log('Account ID:', this.accountId);
    console.log('Film:', this.film);
    console.log('Session ID:', this.sessionId);

    if (this.accountId && this.film && this.sessionId) {
      const filmId = this.film.id;
      const filmTitle = this.film.title;

      this.favsService.addFavorite(this.sessionId, this.accountId, filmId).subscribe(
        () => {
          this.isFavorite = true;
          console.log('Película añadida a favoritos');

          this.snackBar.open(`${filmTitle} ha sido añadida a favoritos`, 'Cerrar', { duration: 5000 });

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

  //Eliminar de favoritos
  removeFromFavorites(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;

      if (this.accountId && this.film && this.sessionId) {
        const filmId = this.film.id;
        const filmTitle = this.film.title;

        this.favsService.removeFavorite(this.sessionId, this.accountId, filmId).subscribe({
          next: () => {
            this.isFavorite = false;
            console.log('Película eliminada de favoritos');
            this.checkIfFavorite(filmId);
            this.snackBar.open(`${filmTitle} ha sido eliminada de favoritos`, 'Cerrar', { duration: 5000 });

          },
          error: (error) => {
            console.error('Error al eliminar de favoritos:', error);
          }
      });
      }
    })
  }

  //Carga de imágenes múltiples
  loadImages(filmId: number): void {
    this.filmService.getFilmImages(filmId).subscribe(images => {
      this.filmImages = images.slice(0, 5); // Se mostrarán 5 imágenes
      this.filmImages.push({ file_path: '' }); // y una última sin file_path para que pueda mostrarse la imagen de no disponible
      console.log('Imágenes:', this.filmImages);
    });
  }


  goBack(): void {
    this.router.navigate(['/films/search']);
  }
}
