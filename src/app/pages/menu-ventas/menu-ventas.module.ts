import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuVentasPageRoutingModule } from './menu-ventas-routing.module';

import { MenuVentasPage } from './menu-ventas.page';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuVentasPageRoutingModule,
    ShareModule
  ],
  declarations: [MenuVentasPage]
})
export class MenuVentasPageModule {}
