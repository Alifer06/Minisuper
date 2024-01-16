import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService {
  
  private url = 'http://192.168.3.21/api_minisuper/detalle_venta'

  constructor() { }

}
