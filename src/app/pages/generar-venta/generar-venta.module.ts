import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenerarVentaPageRoutingModule } from './generar-venta-routing.module';

import { GenerarVentaPage } from './generar-venta.page';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenerarVentaPageRoutingModule,
    ShareModule
  ],
  declarations: [GenerarVentaPage]
})
export class GenerarVentaPageModule {}
