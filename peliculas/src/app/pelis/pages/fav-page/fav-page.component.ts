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
  private sessionId: string | null = localStorage.getItem('sessionId');//Está ya gestionado (queda ver si tira bien)
  private accountId: string | null = localStorage.getItem('account_id');

  constructor(
    private favService: FavService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.sessionId && this.accountId) {
      this.favService.getAllFavs(this.sessionId, this.accountId).subscribe((films: Film[]) => {
        this.films = films;
      });
    }
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
