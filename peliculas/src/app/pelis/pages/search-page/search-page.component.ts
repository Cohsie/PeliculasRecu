import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Film } from '../../interfaces/film.interface';
import { FilmService } from 'src/app/services/film.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: []
})
export class SearchPageComponent {
  public searchInput = new FormControl('');
  public films: Film[] = [];
  public selectedFilm?: Film;
  public genres: {id: number, name: string}[] = [];
  public selectedGenres: number[] = [];
  public favoriteFilter: 'SI' | 'NO' | 'TODAS' = 'TODAS';

  constructor(private filmService: FilmService) {}

  ngOnInit(): void {
    // Cargar géneros desde el servicio
    this.filmService.getCategories().subscribe(categories => {
      this.genres = categories;
    });
  }

  // Buscar películas por título y géneros
  public searchFilms(): void {
    const value: string = this.searchInput.value || '';
    this.filmService.findFilms(value, 'sessionId', 'accountId', 'TODAS', this.selectedGenres)
      .subscribe(films => {
        this.films = films;
        console.log('Películas encontradas:', films);
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
