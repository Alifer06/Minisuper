import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilModalPageRoutingModule } from './perfil-modal-routing.module';

import { PerfilModalPage } from './perfil-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilModalPageRoutingModule
  ],
  declarations: [PerfilModalPage]
})
export class PerfilModalPageModule {}
