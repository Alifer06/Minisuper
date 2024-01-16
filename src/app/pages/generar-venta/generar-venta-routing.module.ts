import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerarVentaPage } from './generar-venta.page';

const routes: Routes = [
  {
    path: '',
    component: GenerarVentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerarVentaPageRoutingModule {}
