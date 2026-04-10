import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reset-password',
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
            <h2>Reset Password</h2>
            <p>Enter your new password below</p>
          </div>

          @if (successMessage) {
            <div class="alert alert-success">
              <i class="fas fa-check-circle"></i> {{ successMessage }}
            </div>
            <div class="auth-footer">
              <p><a routerLink="/auth/login">Go to Login</a></p>
            </div>
          }
          @if (errorMessage) {
            <div class="alert alert-error">
              <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
            </div>
          }

          @if (!successMessage) {
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label for="password">New Password</label>
                <div class="input-wrapper">
                  <i class="fas fa-lock"></i>
                  <input [type]="showPassword ? 'text' : 'password'" id="password" formControlName="password"
                    placeholder="Min. 6 characters"
                    [class.error-border]="form.get('password')?.touched && form.get('password')?.invalid">
                  <i class="fas toggle-eye" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"
                    (click)="showPassword = !showPassword"></i>
                </div>
                @if (form.get('password')?.touched && form.get('password')?.invalid) {
                  <span class="error-text"><i class="fas fa-info-circle"></i>
                    @if (form.get('password')?.errors?.['required']) { Password is required }
                    @else { Minimum 6 characters }
                  </span>
                }
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <div class="input-wrapper">
                  <i class="fas fa-lock"></i>
                  <input [type]="showPassword ? 'text' : 'password'" id="confirmPassword" formControlName="confirmPassword"
                    placeholder="Repeat your password"
                    [class.error-border]="form.get('confirmPassword')?.touched && form.errors?.['mismatch']">
                </div>
                @if (form.get('confirmPassword')?.touched && form.errors?.['mismatch']) {
                  <span class="error-text"><i class="fas fa-info-circle"></i> Passwords do not match</span>
                }
              </div>
              <button type="submit" class="btn btn-primary btn-block btn-lg" [disabled]="isLoading">
                @if (isLoading) { <span class="spinner"></span> } @else { Reset Password }
              </button>
            </form>
            <div class="auth-footer">
              <p><a routerLink="/auth/login"><i class="fas fa-arrow-left"></i> Back to Login</a></p>
            </div>
          }
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
    .form-group label { display: block; font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-text); margin-bottom: var(--spacing-sm); }
    .form-group .input-wrapper { position: relative; }
    .form-group .input-wrapper i { position: absolute; left: var(--spacing-md); top: 50%; transform: translateY(-50%); color: var(--color-text-muted); font-size: var(--font-size-sm); }
    .form-group .input-wrapper .toggle-eye { left: auto; right: var(--spacing-md); cursor: pointer; }
    .form-group .input-wrapper input { width: 100%; padding: var(--spacing-md); padding-left: var(--spacing-2xl); border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-base); transition: all var(--transition-smooth); background: white; }
    .form-group .input-wrapper input:focus { outline: none; border-color: var(--color-secondary); box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.15); }
    .form-group .input-wrapper input.error-border { border-color: var(--color-error); }
    .form-group .error-text { display: block; color: var(--color-error); font-size: var(--font-size-xs); margin-top: var(--spacing-sm); }
    .alert { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md) var(--spacing-lg); border-radius: var(--radius-md); margin-bottom: var(--spacing-lg); font-size: var(--font-size-sm); }
    .alert.alert-error { background: rgba(220, 53, 69, 0.1); color: var(--color-error); border: 1px solid rgba(220, 53, 69, 0.2); }
    .alert.alert-success { background: rgba(40, 167, 69, 0.1); color: #28a745; border: 1px solid rgba(40, 167, 69, 0.2); }
    .auth-footer { text-align: center; margin-top: var(--spacing-xl); }
    .auth-footer a { color: var(--color-secondary); font-weight: var(--font-weight-medium); text-decoration: none; font-size: var(--font-size-sm); }
    .auth-footer a:hover { text-decoration: underline; }
    .spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showPassword = false;
  private token = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];
    if (!this.token) {
      this.errorMessage = 'Invalid reset link.';
    }
  }

  passwordMatchValidator(group: any) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<any>(`${environment.apiUrl}/auth/reset-password/${this.token}`, {
      password: this.form.value.password
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Password reset successful!';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Reset failed. The link may have expired.';
      }
    });
  }
}
