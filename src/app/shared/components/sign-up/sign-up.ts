import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.html',
    styleUrls: ['./sign-up.css'],
})
export class SignUp {
    @Output() registered = new EventEmitter<User>();
    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    submit() {
        if (this.form.valid) {
            this.registered.emit(this.form.value as User);
            this.form.reset();
        }
    }
}
