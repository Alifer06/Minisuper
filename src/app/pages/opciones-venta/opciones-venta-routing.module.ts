import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpcionesVentaPage } from './opciones-venta.page';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: '',
    component: OpcionesVentaPage,
    children: [
      {
        path: 'menu-ventas',
        loadChildren: () => import('./../../pages/menu-ventas/menu-ventas.module').then( m => m.MenuVentasPageModule),
        
      },
      {
        path: 'perfil',
        loadChildren: () => import('./../../pages/perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path: 'inicio',
        loadChildren: () => import('./../../pages/inicio/inicio.module').then( m => m.InicioPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpcionesVentaPageRoutingModule {}
