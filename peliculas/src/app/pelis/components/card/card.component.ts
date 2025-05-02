import { Component, Input, OnInit } from '@angular/core';
import { Film } from '../../interfaces/film.interface';
import { FilmService } from 'src/app/services/film.service';

@Component({
  selector: 'film-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  constructor(private filmService: FilmService){}

  @Input()
  public film!: Film;
  public sinopsis: string = '';
  public genres: {id: number, name: string}[] = [];

  ngOnInit(): void{
    if (!this.film) throw new Error('Film property is required.');//Comprueba si film está definido y si no lo está lanza un error
    //this.sinopsis = this.film.overview;

    // Obtenemos todos los géneros desde el servicio y los filtramos para que solo aparezcan los de lla pellicula
    this.filmService.getCategories().subscribe(categories => {
      this.genres = categories.filter(genre => this.film.genre_ids.includes(genre.id));//genre_ids lo devuelve el método de devolver las peliculas favoritas
      console.log('Géneros cargados:', categories);
    });
  }


}
