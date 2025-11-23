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
    if (this.form.invalid) return;
    this.loading = true;
    this.message = '';

    const { email, password } = this.form.value;
    console.log('Attempt login', { email });

    this.auth.login({ email, password }).subscribe({
      next: (res) => {
        this.loading = false;
        // res.user contains id, username, email, created_at (no password)
        console.log('Login success');
        // Optionally save user to localStorage or a user service
        // localStorage.setItem('me', JSON.stringify(res.user));
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Login failed', err);
        this.message = err?.error?.error ?? 'Login failed';
      }
    });
  }
}
