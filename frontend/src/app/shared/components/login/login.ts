import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    form: FormGroup;
    loading = false;
    message = '';

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        this.message = '';
        this.loading = true;
        const { email, password } = this.form.value;
        this.auth.login({ email, password }).subscribe({
            next: (res: any) => {
                this.loading = false;
                if (res && res.token) {
                    localStorage.setItem('auth_token', res.token);
                }
                this.router.navigate(['/home']);
            },
            error: (err) => {
                this.loading = false;
                console.error('Login failed', err);
                this.message = err?.error?.error ?? 'Invalid email or password';
            }
        });
    }
}
