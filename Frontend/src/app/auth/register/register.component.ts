import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator()
      ]),
      confirmPassword: new FormControl('', [Validators.required, this.passwordMatchValidator.bind(this)])
    });
  }

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value || '';
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const valid = hasUpperCase && hasLowerCase && hasNumber;
      return valid ? null : { passwordStrength: true };
    };
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (this.registerForm && control.value !== this.registerForm.get('password')?.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  register() {
    if (this.registerForm.valid) {
      const { fullName, email, password } = this.registerForm.value;
      const role = 'BUYER'; // veya kullanıcıdan seçtirilir

      this.authService.register({ fullName, email, password, role }).subscribe({
        next: user => {
          if (user) {
            this.errorMessage = null;
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Email already exists or registration failed.';
          }
        },
        error: err => {
          console.error('Register error:', err);
          this.errorMessage = 'Unexpected error occurred.';
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
