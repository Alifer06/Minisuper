import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VentasModalPageRoutingModule } from './ventas-modal-routing.module';

import { VentasModalPage } from './ventas-modal.page';
import { ShareModule } from "../../share/share.module";

@NgModule({
    declarations: [VentasModalPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        VentasModalPageRoutingModule,
        ShareModule
    ]
})
export class VentasModalPageModule {}
