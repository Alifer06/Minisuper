import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductoPageRoutingModule } from './producto-routing.module';

import { ProductoPage } from './producto.page';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    FormsModule,
    IonicModule,
    ProductoPageRoutingModule
  ],
  declarations: [ProductoPage]
})
export class ProductoPageModule {}
