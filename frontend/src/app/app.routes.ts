import { Routes } from '@angular/router';
import { Authentication } from './features/authentication/authentication';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Authentication
    },
    {
        path: 'home',
        loadComponent: () => import('./features/main-home/main-home').then(m => m.MainHome)
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];