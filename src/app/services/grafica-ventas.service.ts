import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraficaVentasService {

  constructor(private http: HttpClient) { }
  
  private url= 'http://192.168.3.21/api_minisuper/grafica_ventas'

  getVentasSemanales(): Observable<any> {
    return this.http.get(`${this.url}`);
  }

  

}
