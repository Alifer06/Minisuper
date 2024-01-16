import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../../services/producto.service'
import { Observable } from 'rxjs';


@Component({
  selector: 'app-footer-total',
  templateUrl: './footer-total.component.html',
  styleUrls: ['./footer-total.component.scss'],
})
export class FooterTotalComponent  implements OnInit {

  total$!: Observable<number>;

  constructor( private productoService: ProductoService) { 

    //Se subscribe al total del atualizado del servicio
    this.total$ = this.productoService.getTotal();
  }

  ngOnInit() {}

}
