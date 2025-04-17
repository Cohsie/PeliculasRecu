import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Film } from '../../interfaces/film.interface';
import { FilmService } from 'src/app/services/film.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: []
})
export class SearchPageComponent {
  constructor(private filmService: FilmService, private snackBar: MatSnackBar) {}
  public searchInput = new FormControl('');
  public films: Film[] = [];
  public selectedFilm?: Film;
  public genres: {id: number, name: string}[] = [];
  public selectedGenres: number[] = [];
  public favoriteFilter: 'SI' | 'NO' | 'TODAS' = 'TODAS';
  private sessionId: string = localStorage.getItem('session_id') ?? '';//Está ya gestionado (queda ver si tira bien)
  private accountId: string = localStorage.getItem('account_id') ?? '';
  //TODO: Apuntes para entender completamente esto


  ngOnInit(): void {
    // Cargar géneros desde el servicio
    this.filmService.getCategories().subscribe(categories => {
      this.genres = categories;
      console.log('Géneros cargados:', categories);  // Verifica los géneros
    });

  }

  public searchFilms(): void {
    const value: string = this.searchInput.value || '';
    this.filmService.findFilms(value, this.sessionId, this.accountId, 'TODAS', this.selectedGenres)
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


  // Manejar la selección de una opción del autocompletado
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
    this.selectedGenres = Array.from(event.target.selectedOptions, (option: any) => option.value);
    this.searchFilms();
  }
}
