import { Component, OnInit } from '@angular/core';
import { Venta, VentaService } from 'src/app/services/venta.service';

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.page.html',
  styleUrls: ['./pruebas.page.scss'],
})
export class PruebasPage implements OnInit {

  constructor( private ventaService : VentaService) { }
  ventas: Venta[] = []; // Usa la interfaz Venta
  
  
  ngOnInit() {
    this.ventaService.getVentas().subscribe({
      next: (data: Venta[]) => { // Manejo exitoso de la respuesta
        this.ventas = data;
      },
      error: (error) => { // Manejo de error
        console.error("Ocurrió un error al obtener las ventas", error);
      }
    });
  }

}
