import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Film } from '../../interfaces/film.interface';
import { FilmService } from 'src/app/services/film.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: []
})
export class SearchPageComponent {
  constructor(private filmService: FilmService, private snackBar: MatSnackBar, private authService: AuthService) {}
  public searchInput = new FormControl('');
  public films: Film[] = [];
  public selectedFilm?: Film;
  public genres: {id: number, name: string}[] = [];
  public selectedGenres: number[] = [];
  public favoriteFilter: 'SI' | 'NO' | 'TODAS' = 'TODAS';
  private accountId: string = localStorage.getItem('account_id') ?? '';
  private sessionId: string = localStorage.getItem('sessionId') ?? '';
  //TODO: Apuntes para entender completamente esto


  ngOnInit(): void {
    const response_token = localStorage.getItem('requestToken');
    const sessionId = localStorage.getItem('sessionId');
    // Cargar géneros desde el servicio
    this.filmService.getCategories().subscribe(categories => {
      this.genres = categories;
      console.log('Géneros cargados:', categories);  // Verifica los géneros
    });

    //? Puede que ni sea necesario
    // if (response_token && !sessionId) {
    //   this.authService.getSessionId().subscribe({
    //     next: (response) => {
    //       console.log('Session ID obtenido:', response);
    //       const sessionId = response.session_id;
    //       localStorage.setItem('sessionId', sessionId);
    //     },
    //     error: (error) => {
    //       console.error('Error al obtener el Session ID:', error);
    //     }
    //   });
    // }

  }

  public searchFilms(): void {
    //const sessionId = localStorage.getItem('session_id')
    const value: string = this.searchInput.value || '';
    console.log(localStorage.getItem('sessionId'));
    this.filmService.findFilms(value, this.sessionId, this.accountId, this.favoriteFilter, this.selectedGenres)
      .subscribe({
        next: (films) => {
          this.films = films;
          console.log('Películas encontradas:', films);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al buscar películas:', err);
          this.films = [];
          this.snackBar.open('Error al cargar las películas. Intenta de nuevo más tarde.', 'Cerrar', {
            duration: 5000,
          });
        }
      });
  }


  // Esto es para el autocompletado
  public onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedFilm = undefined;
      return;
    }

    const film: Film = event.option.value;
    this.searchInput.setValue(film.title);
    this.selectedFilm = film;
  }

  // Manejar el cambio en la selección de géneros
  public onCategoryChange(event: any): void {
    this.selectedGenres = event.value;
    console.log('Géneros seleccionados:', this.selectedGenres); // Verifica los géneros seleccionados
    this.searchFilms();
  }
}
