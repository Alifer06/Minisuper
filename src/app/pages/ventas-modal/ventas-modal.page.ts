import { Component, Input, OnInit } from '@angular/core';
import { Venta } from 'src/app/services/venta.service';

@Component({
  selector: 'app-ventas-modal',
  templateUrl: './ventas-modal.page.html',
  styleUrls: ['./ventas-modal.page.scss'],
})
export class VentasModalPage implements OnInit {
  @Input() venta!: Venta; // Recibe la venta como input

  constructor() { }

  ngOnInit() {
  }

}
