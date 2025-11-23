import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Login } from '../../shared/components/login/login';
import { SignUp } from '../../shared/components/sign-up/sign-up';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-authentication',
    standalone: true,
    imports: [
        CommonModule,
        Login,
        SignUp
    ],
    templateUrl: './authentication.html',
    styleUrls: ['./authentication.css'],
})
export class Authentication {
    selectedTab: 'login' | 'signup' = 'login';

    switchTab(tab: 'login' | 'signup') {
        this.selectedTab = tab;
    }
}
