export interface Usuario {
  id_usuario: string;
  usuario: string;
  id_rol: string;
  rol: string;
  observaciones?: string;
  nombre_publico: string;
  habilitado: number;
  api_movies: string;//Dato pedido por el profesor. Cada usuario tiene una API key distinta
  account_id: string;//ID de la cuenta de TMDB de cada usuario
}
