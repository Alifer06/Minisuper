import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Categoria{
  id_categoria: string;
  nombre: string;
}
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private url = 'http://192.168.3.21/api_minisuper/categorias'

  constructor(private http: HttpClient) { }
  get(){
    return this.http.get<[Categoria]>(this.url)
  }

}
