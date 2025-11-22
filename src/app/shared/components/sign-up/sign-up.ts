import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface User {
    username: string;
    email: string;
    password: string;
    createdAt: string;
}
@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.html',
    styleUrl: './sign-up.css',

    imports: [
        ReactiveFormsModule,
        CommonModule,
    ]
})
export class SignUp {
    myForm: FormGroup;
    users: User[] = [];

    constructor(private fb: FormBuilder) {
        this.myForm = this.fb.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.loadUsers();
    }

    private loadUsers() {
        const raw = localStorage.getItem('usersTable');
        if (raw) {
            try {
                this.users = JSON.parse(raw) as User[];
            } catch {
                this.users = [];
            }
        }
    }
    private saveUsers() {
        localStorage.setItem('usersTable', JSON.stringify(this.users));
    }

    addUser() {
        if (this.myForm.invalid) return;

        const { username, email, password } = this.myForm.value;
        const createdAt = new Date().toISOString();

        const user: User = {
            username,
            email,
            password,
            createdAt
        };

        this.users.push(user);
        this.saveUsers();

        this.myForm.reset();
    }

    // helper to show masked password if you want
    getMasked(pwd: string) {
        return '*'.repeat(Math.min(pwd.length, 6));
    }

    clearAll() {
        this.users = [];
        localStorage.removeItem('usersTable');
    }
}
