import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-background">
        <div class="auth-pattern"></div>
      </div>
      
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="logo">
              <span class="logo-text">Liya</span>
              <span class="logo-sub">Creation</span>
            </div>
            <h2>Create Account</h2>
            <p>Join our premium shopping experience</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            @if (errorMessage) {
              <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i>
                {{ errorMessage }}
              </div>
            }

            <div class="form-group">
              <label for="name">Full Name *</label>
              <div class="input-wrapper">
                <i class="fas fa-user"></i>
                <input type="text" id="name" formControlName="name" placeholder="Your full name"
                  (keypress)="onlyText($event)" (input)="sanitizeName($event)"
                  [class.error-border]="registerForm.get('name')?.touched && registerForm.get('name')?.invalid">
              </div>
              @if (registerForm.get('name')?.touched && registerForm.get('name')?.invalid) {
                <span class="error-text">
                  <i class="fas fa-info-circle"></i>
                  @if (registerForm.get('name')?.errors?.['required']) {
                    Full name is required
                  } @else if (registerForm.get('name')?.errors?.['pattern']) {
                    Name cannot contain numbers or special characters
                  }
                </span>
              }
            </div>

            <div class="form-group">
              <label for="email">Email Address *</label>
              <div class="input-wrapper">
                <i class="fas fa-envelope"></i>
                <input type="email" id="email" formControlName="email" placeholder="your@email.com"
                  [class.error-border]="registerForm.get('email')?.touched && registerForm.get('email')?.invalid">
              </div>
              @if (registerForm.get('email')?.touched && registerForm.get('email')?.invalid) {
                <span class="error-text">
                  <i class="fas fa-info-circle"></i>
                  @if (registerForm.get('email')?.errors?.['required']) {
                    Email is required
                  } @else if (registerForm.get('email')?.errors?.['email']) {
                    Please enter a valid email address
                  }
                </span>
              }
            </div>

            <div class="form-group">
              <label for="phone">Phone Number *</label>
              <div class="input-wrapper">
                <i class="fas fa-phone"></i>
                <input type="tel" id="phone" formControlName="phone" placeholder="10-digit mobile number" maxlength="10"
                  (keypress)="onlyDigits($event)" (input)="sanitizePhone($event)"
                  [class.error-border]="registerForm.get('phone')?.touched && registerForm.get('phone')?.invalid">
              </div>
              @if (registerForm.get('phone')?.touched && registerForm.get('phone')?.invalid) {
                <span class="error-text">
                  <i class="fas fa-info-circle"></i>
                  @if (registerForm.get('phone')?.errors?.['required']) {
                    Phone number is required
                  } @else if (registerForm.get('phone')?.errors?.['pattern']) {
                    Please enter a valid 10-digit phone number
                  }
                </span>
              }
            </div>

            <div class="form-group">
              <label for="password">Password *</label>
              <div class="input-wrapper">
                <i class="fas fa-lock"></i>
                <input type="password" id="password" formControlName="password" placeholder="Min 6 characters"
                  [class.error-border]="registerForm.get('password')?.touched && registerForm.get('password')?.invalid">
              </div>
              @if (registerForm.get('password')?.touched && registerForm.get('password')?.invalid) {
                <span class="error-text">
                  <i class="fas fa-info-circle"></i>
                  @if (registerForm.get('password')?.errors?.['required']) {
                    Password is required
                  } @else if (registerForm.get('password')?.errors?.['minlength']) {
                    Password must be at least 6 characters
                  }
                </span>
              }
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password *</label>
              <div class="input-wrapper">
                <i class="fas fa-lock"></i>
                <input type="password" id="confirmPassword" formControlName="confirmPassword" placeholder="Re-enter password"
                  [class.error-border]="registerForm.get('confirmPassword')?.touched && registerForm.get('confirmPassword')?.invalid">
              </div>
              @if (registerForm.get('confirmPassword')?.touched && registerForm.get('confirmPassword')?.invalid) {
                <span class="error-text">
                  <i class="fas fa-info-circle"></i>
                  @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                    Please confirm your password
                  }
                </span>
              }
              @if (registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched) {
                <span class="error-text"><i class="fas fa-info-circle"></i> Passwords do not match</span>
              }
            </div>

            <div class="terms-text">
              <p>By creating an account, you agree to our <a routerLink="/terms-of-service">Terms of Service</a> and <a routerLink="/privacy-policy">Privacy Policy</a></p>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" [disabled]="isLoading">
              @if (isLoading) {
                <span class="spinner"></span>
              } @else {
                Create Account
              }
            </button>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/auth/login">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; position: relative; overflow: hidden; }
    .auth-background { position: absolute; inset: 0; background: linear-gradient(135deg, var(--color-forest) 0%, var(--color-primary) 100%); }
    .auth-pattern { position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
    .auth-container { flex: 1; display: flex; align-items: center; justify-content: center; padding: var(--spacing-xl); position: relative; z-index: 1; }
    .auth-card { background: var(--color-bg-light); padding: var(--spacing-2xl); border-radius: var(--radius-2xl); box-shadow: var(--shadow-2xl); width: 100%; max-width: 440px; animation: fadeInUp 0.6s ease-out; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .auth-header { text-align: center; margin-bottom: var(--spacing-xl); }
    .auth-header .logo { display: flex; flex-direction: column; margin-bottom: var(--spacing-xl); }
    .auth-header .logo .logo-text { font-family: var(--font-heading); font-size: 2rem; font-weight: var(--font-weight-bold); color: var(--color-primary); line-height: 1.2; }
    .auth-header .logo .logo-sub { font-family: var(--font-body); font-size: 0.6rem; color: var(--color-secondary); letter-spacing: 0.3em; text-transform: uppercase; }
    .auth-header h2 { font-family: var(--font-heading); font-size: var(--font-size-2xl); color: var(--color-text); margin-bottom: var(--spacing-sm); }
    .auth-header p { font-size: var(--font-size-sm); color: var(--color-text-light); margin: 0; }
    .form-group { margin-bottom: var(--spacing-lg); }
    .form-group label { display: block; font-family: var(--font-body); font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-text); margin-bottom: var(--spacing-sm); }
    .form-group .input-wrapper { position: relative; }
    .form-group .input-wrapper i { position: absolute; left: var(--spacing-md); top: 50%; transform: translateY(-50%); color: var(--color-text-muted); font-size: var(--font-size-sm); }
    .form-group .input-wrapper input { width: 100%; padding: var(--spacing-md); padding-left: var(--spacing-2xl); border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-base); transition: all var(--transition-smooth); background: white; }
    .form-group .input-wrapper input:focus { outline: none; border-color: var(--color-secondary); box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.15); }
    .form-group .input-wrapper input.error-border { border-color: var(--color-error); }
    .form-group .error-text { display: block; color: var(--color-error); font-size: var(--font-size-xs); margin-top: var(--spacing-sm); }
    .form-group .error-text i { margin-right: var(--spacing-xs); }
    .terms-text { font-size: var(--font-size-xs); color: var(--color-text-muted); text-align: center; margin-bottom: var(--spacing-lg); }
    .terms-text a { color: var(--color-secondary); text-decoration: none; }
    .terms-text a:hover { text-decoration: underline; }
    .alert { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md) var(--spacing-lg); border-radius: var(--radius-md); margin-bottom: var(--spacing-lg); font-size: var(--font-size-sm); }
    .alert.alert-error { background: rgba(220, 53, 69, 0.1); color: var(--color-error); border: 1px solid rgba(220, 53, 69, 0.2); }
    .auth-footer { text-align: center; margin-top: var(--spacing-xl); }
    .auth-footer p { font-size: var(--font-size-sm); color: var(--color-text-light); margin: 0; }
    .auth-footer a { color: var(--color-secondary); font-weight: var(--font-weight-medium); text-decoration: none; }
    .auth-footer a:hover { text-decoration: underline; }
    .spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 576px) { .auth-card { padding: var(--spacing-xl); } }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s\-']+$/)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  isLoading = false;
  errorMessage = '';

  passwordMatchValidator(form: any): any {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onlyText(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (
      !(charCode >= 65 && charCode <= 90) && // A-Z
      !(charCode >= 97 && charCode <= 122) && // a-z
      !(charCode >= 32 && charCode <= 32) && // space
      !(charCode >= 45 && charCode <= 45) && // -
      !(charCode >= 39 && charCode <= 39) && // '
      charCode !== 8 && // backspace
      charCode !== 46 // delete
    ) {
      event.preventDefault();
    }
  }

  sanitizeName(event: any): void {
    const input = event.target;
    input.value = input.value.replace(/[^a-zA-Z\s\-']/g, '');
  }

  onlyDigits(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  sanitizePhone(event: any): void {
    const input = event.target;
    input.value = input.value.replace(/\D/g, '').slice(0, 10);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { name, email, phone, password } = this.registerForm.value;

    this.authService.register({ name: name!, email: email!, phone: phone!, password: password! }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.router.navigate(['/']);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
