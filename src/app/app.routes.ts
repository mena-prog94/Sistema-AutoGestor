import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },

  {
    path: 'vehiculos',
    loadComponent: () => import('./vehiculos/vehiculos.page').then( m => m.VehiculosPage)
  },
  {
    path: 'piezas',
    loadComponent: () => import('./pages/piezas/piezas.page').then( m => m.PiezasPage)
  },
  {
    path: 'agregar-pieza',
    loadComponent: () => import('./pages/agregar-pieza/agregar-pieza.page').then( m => m.AgregarPiezaPage)
  },
];
