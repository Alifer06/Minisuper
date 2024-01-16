import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuVentasPage } from './menu-ventas.page';

const routes: Routes = [
  {
    path: '',
    component: MenuVentasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuVentasPageRoutingModule {}
