import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  submitting = false;
  submitted = false;
  errorMsg = '';

  formModel: any = {
    name: '',
    email: '',
    subject: '',
    message: '',
    shortTag: ''
  };

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.submitted = true;
      console.log('Contact payload', this.formModel);
      form.resetForm();
      setTimeout(() => (this.submitted = false), 3500);
    }, 900);
  }
}
