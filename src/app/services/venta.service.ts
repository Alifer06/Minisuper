import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Producto {
  id_producto: number;
  codigo_producto : string;
  nombre: string;
  precio: number;
  // otros campos relevantes...
}

export interface DetalleVenta {
  id_detalle_venta: number;
  cantidad: number;
  subtotal: number;
  producto?: Producto; // Opcional, si decides incluir datos del producto aquí
  id_producto: number;
  id_venta: number;
  // otros campos relevantes...
}

export interface Venta {
  id_venta: number;
  fecha: Date;
  total_venta: number;
  detalles: DetalleVenta[]; // Un array de detalles para cada venta
  // otros campos relevantes...
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  
  private url = 'http://192.168.3.21/api_minisuper/ventas'
  private url2 = 'http://192.168.3.21/api_minisuper/ventas_mensual';


  constructor(private http: HttpClient) { }
   // Obtener ventas de una semana específica
   getVentas(): Observable<Venta[]> { // Usa la interfaz Venta
    return this.http.get<Venta[]>(this.url);
  }
  
  getVentasPorSemana(startDate: string, endDate: string): Observable<Venta[]> {
    let params = new HttpParams();
    params = params.append('startDate', startDate);
    params = params.append('endDate', endDate);
    return this.http.get<Venta[]>(this.url, { params: params });
  }
  getVentasPorMes(mes: number, ano: number): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.url2, {
      params: {
        mes: mes.toString(),
        ano: ano.toString()
      }
    });
  }
  

 
}