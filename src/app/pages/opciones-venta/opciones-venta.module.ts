import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpcionesVentaPageRoutingModule } from './opciones-venta-routing.module';

import { OpcionesVentaPage } from './opciones-venta.page';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpcionesVentaPageRoutingModule,
    ShareModule
  ],
  declarations: [OpcionesVentaPage]
})
export class OpcionesVentaPageModule {}
