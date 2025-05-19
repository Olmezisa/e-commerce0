import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SellerService } from '../../core/services/seller.service';

@Component({
  selector: 'app-seller-register',
  standalone:false,
  templateUrl: './seller-register.component.html',
  styleUrls: ['./seller-register.component.css']
})
export class SellerRegisterComponent implements OnInit {
  registerForm!: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: SellerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
  fullName: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [
    Validators.required,
    Validators.minLength(8),
    this.passwordStrengthValidator()
  ]],
  confirmPassword: ['', [Validators.required, this.passwordMatchValidator.bind(this)]],
  corporate: [false],
  brandName: ['']
});

    this.registerForm.get('corporate')!.valueChanges.subscribe((corp: boolean) => {
      const brandControl = this.registerForm.get('brandName')!;
      if (corp) {
        brandControl.setValidators([Validators.required]);
      } else {
        brandControl.clearValidators();
      }
      brandControl.updateValueAndValidity();
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

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    this.auth.registerSeller(this.registerForm.value).subscribe({
      next: () => {
        alert('registration is successful!');
        this.router.navigate(['/auth/login']);
      },
      error: err => {
        console.error('registration failed.', err);
        this.error = err.error?.error || 'error in registration';
      }
    });
  }
}
