import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'inicio-sesion',
    loadChildren: () => import('./pages/inicio-sesion/inicio-sesion.module').then( m => m.InicioSesionPageModule)
  },
  {
    path: 'opciones-venta',
    loadChildren: () => import('./pages/opciones-venta/opciones-venta.module').then( m => m.OpcionesVentaPageModule)
  },
  {
    path: 'menu-ventas',
    loadChildren: () => import('./pages/menu-ventas/menu-ventas.module').then( m => m.MenuVentasPageModule)
  },
  {
    path: 'generar-venta',
    loadChildren: () => import('./pages/generar-venta/generar-venta.module').then( m => m.GenerarVentaPageModule)
  },
  {
    path: 'producto',
    loadChildren: () => import('./pages/producto/producto.module').then( m => m.ProductoPageModule)
  },
  
  {
    path: 'reporte-ventas',
    loadChildren: () => import('./pages/reporte-ventas/reporte-ventas.module').then( m => m.ReporteVentasPageModule)
  },
  {
    path: 'pruebas',
    loadChildren: () => import('./pages/pruebas/pruebas.module').then( m => m.PruebasPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'ventas-modal',
    loadChildren: () => import('./pages/ventas-modal/ventas-modal.module').then( m => m.VentasModalPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
