import { Component, OnInit } from '@angular/core';
import { FavService } from 'src/app/services/fav.service';
import { Film } from '../../interfaces/film.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-favs-page',
  templateUrl: './fav-page.component.html',
  styles: []
})
export class FavPageComponent implements OnInit {
  films: Film[] = [];
  sessionId: string | null = null;
  accountId: string | null = null;

  constructor(
    private favService: FavService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('sessionId');
    this.accountId = localStorage.getItem('account_id');
    console.log(this.accountId);
    console.log(this.films);

    if (this.sessionId && this.accountId) {
      this.favService.getAllFavs(this.sessionId, this.accountId).subscribe((films: Film[]) => {
        this.films = films;
        console.log('account después de llamar al método', this.accountId);
        console.log('Después de llamar al método: ', this.films);
      });
    }
    console.log('api_movies: ',localStorage.getItem('api_movies'));
    console.log('usuario: ',localStorage.getItem('usuario'));
    console.log('token: ', localStorage.getItem('token'));
    console.log('account_id: ', localStorage.getItem('account_id'));

  }

  removeFromFavorites(filmId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (!result || !this.sessionId || !this.accountId) return;

      this.favService.removeFavorite(this.sessionId, this.accountId, filmId).subscribe(
        () => {
          this.films = this.films.filter((film) => film.id !== filmId);
          this.showSnackbar('Película eliminada de favoritos');
        },
        (error) => {
          console.error('Error al eliminar de favoritos:', error);
        }
      );
    });
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
