import { Routes } from '@angular/router';
import { Authentication } from './features/authentication/authentication';
import { AuthGuard } from './services/auth.guard';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Authentication
    },
    {
        path: 'home',
        loadComponent: () => import('./features/main-home/main-home').then(m => m.MainHome),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];