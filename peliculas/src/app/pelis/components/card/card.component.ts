import { Component, Input, OnInit } from '@angular/core';
import { Film } from '../../interfaces/film.interface';

@Component({
  selector: 'film-card',
  templateUrl: './card.component.html',
  styles: [
  ]
})
export class CardComponent {

  @Input()
  public film!: Film;
  public sinopsis: string = '';

  ngOnInit(): void{
    if (!this.film) throw new Error('Film property is required.');//Comprueba si film está definido y si no lo está lanza un error
    this.sinopsis = this.film.overview;
  }

}
