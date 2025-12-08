import { Routes } from '@angular/router';
import { Authentication } from './features/authentication/authentication';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Authentication,
  },
  {
    path: 'signup',
    component: Authentication,
  },
  {
    path: 'home',
    loadComponent: () => import('./features/main-home/main-home').then((m) => m.MainHome),
    canActivate: [AuthGuard],
  },
  {
    path: 'marketplace',
    loadComponent: () => import('./features/marketplace/marketplace').then((m) => m.Marketplace),
    canActivate: [AuthGuard],
  },
  {
    path: 'marketplace/product/:id',
    loadComponent: () =>
      import('./features/product-preview/product-preview').then((m) => m.ProductPreview),
    canActivate: [AuthGuard],
  },
  {
    path: 'shops/:id',
    loadComponent: () => import('./features/shops/shops').then((m) => m.Shops),
    canActivate: [AuthGuard],
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout').then((m) => m.Checkout),
    canActivate: [AuthGuard],
    title: 'Shopping Cart',
  },
  {
    path: '**',
    redirectTo: 'home', // <-- Change de 'login' à 'home' ou garde login
  },
];
