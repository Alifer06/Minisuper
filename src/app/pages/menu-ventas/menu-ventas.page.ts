import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ProductoService } from 'src/app/services/producto.service';
import { ProductoPage } from '../producto/producto.page';

@Component({
  selector: 'app-menu-ventas',
  templateUrl: './menu-ventas.page.html',
  styleUrls: ['./menu-ventas.page.scss'],
})
export class MenuVentasPage implements OnInit {

  constructor(private service: ProductoService  ,
              private alertCtrl: AlertController, 
              private modalCtrl: ModalController) { }
  
  agregarProducto(){
    this.modalCtrl.create({
      component: ProductoPage
    }).then (modal => modal.present());
  }
  
  ngOnInit() {
  }

}
