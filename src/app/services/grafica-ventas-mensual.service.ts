import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface VentaS {
  id_venta: number;
  semana: string;
  total_semanal: number;
  // otros campos relevantes...
}

@Injectable({
  providedIn: 'root'
})
export class GraficaVentasMensualService {

  private url = 'http://192.168.3.21/api_minisuper/grafica_ventas_mensual';

  constructor(private http: HttpClient) { }

  getVentasPorMes(mes: number, ano: number): Observable<VentaS[]> {
    return this.http.get<VentaS[]>(this.url, {
      params: {
        mes: mes.toString(),
        ano: ano.toString()
      }
    });
  }
  
}
