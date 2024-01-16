import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

export interface VentaTotal {
  id_venta: number;
  fecha: Date;
  total_venta: number;
  // otros campos relevantes...
}
@Injectable({
  providedIn: 'root'
})
export class VentaTotalService {
  
  private url= 'http://192.168.3.21/api_minisuper/ventas_total'
  constructor(private http: HttpClient) { }

  getTotalVentasDelDia(): Observable<any> {
    return this.http.get(`${this.url}`);
  }
 
}

