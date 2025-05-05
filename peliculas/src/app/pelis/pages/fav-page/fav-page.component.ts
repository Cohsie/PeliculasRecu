import { Component, OnInit } from '@angular/core';
import { FavService } from 'src/app/services/fav.service';
import { Film } from '../../interfaces/film.interface';

@Component({
  selector: 'app-favs-page',
  templateUrl: './fav-page.component.html',
  styleUrls: ['./fav-page.component.scss']
})
export class FavPageComponent implements OnInit {
  films: Film[] = [];
  private accountId: string = localStorage.getItem('account_id') ?? '';
  private sessionId: string = localStorage.getItem('sessionId') ?? '';

  constructor(
    private favService: FavService,
  ) {}

  ngOnInit(): void {

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
}
