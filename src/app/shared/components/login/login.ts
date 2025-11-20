import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  form: FormGroup;
  error: string | null = null;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async submit() {
    this.error = null;
    if (this.form.invalid) {
      this.error = 'Please fill email and password.';
      return;
    }

    this.loading = true;
    const email = this.form.value.email.trim().toLowerCase();
    const password = this.form.value.password;

    const user = this.userService.findByEmail(email);

    // No user
    if (!user) {
      this.loading = false;
      this.error = 'No account found with this email.';
      return;
    }

    // Locked?
    if (this.userService.isLocked(user)) {
      const ms = this.userService.lockRemainingMs(user);
      const minutes = Math.ceil(ms / 60000);
      this.loading = false;
      this.error = `Account locked. Try again in ${minutes} minute(s).`;
      return;
    }

    // Check password (plain text here because local demo)
    if (user.password === password) {
      // success
      this.userService.resetFailedAttempts(user.email);
      // Navigate to home (adjust route as your app uses)
      this.router.navigate(['/home']);
    } else {
      // failed
      this.userService.recordFailedAttempt(user.email);
      const updated = this.userService.findByEmail(user.email)!;
      if (this.userService.isLocked(updated)) {
        const ms = this.userService.lockRemainingMs(updated);
        const minutes = Math.ceil(ms / 60000);
        this.error = `Too many failed attempts. Account locked for ${minutes} minute(s).`;
      } else {
        const attemptsLeft = Math.max(0, this.userService.MAX_FAILED - (updated.failedAttempts ?? 0));
        this.error = `Wrong password. ${attemptsLeft} attempt(s) left.`;
      }
    }

    this.loading = false;
  }
}
