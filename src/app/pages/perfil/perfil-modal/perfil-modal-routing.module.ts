import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilModalPage } from './perfil-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilModalPageRoutingModule {}
