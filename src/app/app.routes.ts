import { Routes } from '@angular/router';
import { Authentication } from './features/authentication/authentication';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Authentication },
];
    