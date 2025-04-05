export interface Film {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: Array<{ id: number, name: string }>;
}
