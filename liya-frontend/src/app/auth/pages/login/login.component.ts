import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
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
            <h2>Welcome Back</h2>
            <p>Sign in to your premium shopping experience</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            @if (errorMessage) {
              <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i>
                {{ errorMessage }}
              </div>
            }

            <div class="form-group">
              <label for="email">Email Address</label>
              <div class="input-wrapper">
                <i class="fas fa-envelope"></i>
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email"
                  placeholder="your@email.com"
                  [class.error-border]="loginForm.get('email')?.touched && loginForm.get('email')?.invalid"
                >
              </div>
              @if (loginForm.get('email')?.touched && loginForm.get('email')?.invalid) {
                <span class="error-text">
                  <i class="fas fa-info-circle"></i>
                  @if (loginForm.get('email')?.errors?.['required']) {
                    Email is required
                  } @else if (loginForm.get('email')?.errors?.['email']) {
                    Please enter a valid email address
                  }
                </span>
              }
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <i class="fas fa-lock"></i>
                <input 
                  type="password" 
                  id="password" 
                  formControlName="password"
                  placeholder="Enter your password"
                  [class.error-border]="loginForm.get('password')?.touched && loginForm.get('password')?.invalid"
                >
              </div>
              @if (loginForm.get('password')?.touched && loginForm.get('password')?.invalid) {
                <span class="error-text"><i class="fas fa-info-circle"></i> Password is required</span>
              }
            </div>

            <div class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox">
                <span>Remember me</span>
              </label>
              <a routerLink="/auth/forgot-password" class="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" [disabled]="isLoading">
              @if (isLoading) {
                <span class="spinner"></span>
              } @else {
                Sign In
              }
            </button>
          </form>

          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/auth/register">Create one</a></p>
          </div>

          <div class="divider"><span>or</span></div>

          <button type="button" class="btn-google" (click)="loginWithGoogle()">
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          @if (googleError) {
            <div class="alert alert-error" style="margin-top:12px">
              <i class="fas fa-exclamation-circle"></i> Google sign-in failed. Please try again.
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
    .form-group label { display: block; font-family: var(--font-body); font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-text); margin-bottom: var(--spacing-sm); }
    .form-group .input-wrapper { position: relative; }
    .form-group .input-wrapper i { position: absolute; left: var(--spacing-md); top: 50%; transform: translateY(-50%); color: var(--color-text-muted); font-size: var(--font-size-sm); }
    .form-group .input-wrapper input { width: 100%; padding: var(--spacing-md); padding-left: var(--spacing-2xl); border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-base); transition: all var(--transition-smooth); background: white; }
    .form-group .input-wrapper input:focus { outline: none; border-color: var(--color-secondary); box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.15); }
    .form-group .input-wrapper input.error-border { border-color: var(--color-error); }
    .form-group .error-text { display: block; color: var(--color-error); font-size: var(--font-size-xs); margin-top: var(--spacing-sm); }
    .form-group .error-text i { margin-right: var(--spacing-xs); }
    .form-options { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-xl); font-size: var(--font-size-sm); }
    .checkbox-wrapper { display: flex; align-items: center; gap: var(--spacing-sm); color: var(--color-text-light); cursor: pointer; }
    .checkbox-wrapper input { width: 18px; height: 18px; accent-color: var(--color-secondary); }
    .forgot-link { color: var(--color-secondary); text-decoration: none; font-weight: var(--font-weight-medium); }
    .forgot-link:hover { text-decoration: underline; }
    .alert { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md) var(--spacing-lg); border-radius: var(--radius-md); margin-bottom: var(--spacing-lg); font-size: var(--font-size-sm); }
    .alert.alert-error { background: rgba(220, 53, 69, 0.1); color: var(--color-error); border: 1px solid rgba(220, 53, 69, 0.2); }
    .auth-footer { text-align: center; margin-top: var(--spacing-xl); }
    .auth-footer p { font-size: var(--font-size-sm); color: var(--color-text-light); margin: 0; }
    .auth-footer a { color: var(--color-secondary); font-weight: var(--font-weight-medium); text-decoration: none; }
    .auth-footer a:hover { text-decoration: underline; }
    .spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0 16px; color: var(--color-text-muted); font-size: var(--font-size-sm); }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--color-border); }
    .btn-google { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; border: 2px solid var(--color-border); border-radius: var(--radius-md); background: white; font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text); cursor: pointer; transition: all 0.2s; font-family: var(--font-body); }
    .btn-google:hover { border-color: #4285F4; background: #f8f9ff; }
    @media (max-width: 576px) { .auth-card { padding: var(--spacing-xl); } }
  `]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isLoading = false;
  errorMessage = '';
  googleError = false;

  ngOnInit(): void {
    this.googleError = this.route.snapshot.queryParams['error'] === 'google_failed';
    this.checkSessionAuth();
  }

  private checkSessionAuth(): void {
    this.http.get<any>(`${environment.apiUrl}/auth/me`, { withCredentials: true }).subscribe({
      next: (response) => {
        if (response.success && response.data?.user) {
          const user = response.data.user;
          this.authService.setCurrentUser(user);
          
          if (user.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigate([returnUrl]);
          }
        }
      },
      error: () => {
        // Not logged in, stay on login page
      }
    });
  }

  loginWithGoogle(): void {
    window.location.href = 'http://localhost:3000/api/auth/google';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value as { email: string; password: string }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          if (response.data?.user.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate([returnUrl]);
          }
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
