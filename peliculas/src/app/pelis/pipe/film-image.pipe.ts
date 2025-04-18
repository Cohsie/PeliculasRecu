import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filmImage'
})
export class FilmImagePipe implements PipeTransform {
  transform(filePath: string): string {
    return filePath
      ? 'https://image.tmdb.org/t/p/w500' + filePath
      : 'assets/images/no-image.jpg'; // imagen por defecto si no hay file_path
  }
}
