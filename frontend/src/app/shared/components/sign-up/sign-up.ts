import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SignupService } from '../../../services/signup.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css']
})
export class SignUp {
  @Output() goToLogin = new EventEmitter<void>();


  myForm: FormGroup;
  saving = false;
  message = '';

  constructor(private fb: FormBuilder, private signupService: SignupService) {
    this.myForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.myForm.invalid) return;

    this.saving = true;
    this.message = '';

    const { username, email, password } = this.myForm.value;

    this.signupService.signup({ username, email, password }).subscribe({
      next: (res) => {
        this.saving = false;
        this.message = 'Account created — id: ' + (res.user?.id ?? '');
        this.myForm.reset();
        alert('Signup successful! Please log in.');
        this.goToLogin.emit();
      },
      error: (err) => {
        this.saving = false;
        this.message = err?.error?.error ?? 'Signup failed';
      }
    });
  }
}
