import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css'],
})
export class SignUp {
  @Output() goToLogin = new EventEmitter<void>();

  myForm: FormGroup;
  saving = false;

  // POUR LE MODAL
  showModal = false;
  modalMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.myForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.myForm.invalid) return;

    this.saving = true;

    const { username, email, password } = this.myForm.value;

    this.auth.signup({ username, email, password }).subscribe({
      next: (res) => {
        this.saving = false;

        this.modalMessage = 'Your account has been created successfully!';
        this.showModal = true;

        this.myForm.reset();
      },
      error: (err) => {
        this.saving = false;

        this.modalMessage = err?.error?.error ?? 'Signup failed';
        this.showModal = true;
      },
    });
  }

  closeModal() {
    this.showModal = false;
    this.goToLogin.emit(); // redirection vers login
  }
}
