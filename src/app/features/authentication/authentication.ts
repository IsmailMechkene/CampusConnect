import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Login } from '../../shared/components/login/login';
import { SignUp } from '../../shared/components/sign-up/sign-up';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';

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
export class Authentication implements OnInit, OnDestroy {
    selectedTab: 'login' | 'signup' = 'login';
    users: User[] = [];
    private sub = new Subscription();

    constructor(private userService: UserService) {}

    ngOnInit() {
        this.sub.add(this.userService.users$.subscribe(u => this.users = u));
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    switchTab(tab: 'login' | 'signup') {
        this.selectedTab = tab;
    }

    onRegistered(user: User) {
        this.userService.addUser(user);
        this.selectedTab = 'login';
    }
}
