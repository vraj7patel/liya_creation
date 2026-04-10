import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService, Order } from '../../../core/services/order.service';
import { AddressService, SavedAddress } from '../../../core/services/address.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule, ReactiveFormsModule],
  template: `
    <div class="dashboard-page">

      <!-- Hero Header -->
      <div class="dash-hero">
        <div class="container">
          <div class="dash-hero-content">
            <div class="avatar">
              <span>{{ getInitial() }}</span>
            </div>
            <div>
              <p class="dash-welcome">Welcome back</p>
              <h1>{{ authService.currentUser()?.name }}</h1>
              <span class="dash-badge">{{ authService.currentUser()?.role === 'admin' ? 'Administrator' : 'Premium Member' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="dashboard-layout">

          <!-- Sidebar -->
          <aside class="dashboard-sidebar">
            <nav class="sidebar-nav">
              <button class="nav-item" [class.active]="activeTab === 'profile'" (click)="activeTab = 'profile'">
                <span class="nav-icon"><i class="fas fa-user"></i></span>
                <span>Profile</span>
              </button>
              <a class="nav-item" routerLink="/user/orders">
                <span class="nav-icon"><i class="fas fa-box"></i></span>
                <span>My Orders</span>
              </a>
              <button class="nav-item" [class.active]="activeTab === 'edit-profile'" (click)="activeTab = 'edit-profile'">
                <span class="nav-icon"><i class="fas fa-pen"></i></span>
                <span>Edit Profile</span>
              </button>
              <button class="nav-item" [class.active]="activeTab === 'saved-address'" (click)="activeTab = 'saved-address'">
                <span class="nav-icon"><i class="fas fa-map-marker-alt"></i></span>
                <span>Saved Address</span>
              </button>
              <button class="nav-item" [class.active]="activeTab === 'change-password'" (click)="activeTab = 'change-password'">
                <span class="nav-icon"><i class="fas fa-lock"></i></span>
                <span>Change Password</span>
              </button>
            </nav>
          </aside>

          <!-- Main Content -->
          <main class="dashboard-content">

            <!-- Profile -->
            @if (activeTab === 'profile') {
              <div class="content-card">
                <div class="card-head">
                  <h2><i class="fas fa-user"></i> Profile Information</h2>
                </div>
                @if (authService.currentUser(); as user) {
                  <div class="profile-grid">
                    <div class="profile-field">
                      <span class="field-label">Full Name</span>
                      <span class="field-value">{{ user.name }}</span>
                    </div>
                    <div class="profile-field">
                      <span class="field-label">Email Address</span>
                      <span class="field-value">{{ user.email }}</span>
                    </div>
                    <div class="profile-field">
                      <span class="field-label">Phone Number</span>
                      <span class="field-value">{{ user.phone || '—' }}</span>
                    </div>
                    <div class="profile-field">
                      <span class="field-label">Account Type</span>
                      <span class="field-value">{{ user.role === 'admin' ? 'Administrator' : 'Premium Customer' }}</span>
                    </div>
                  </div>
                  <button class="btn-luxury" (click)="activeTab = 'edit-profile'">
                    <i class="fas fa-pen"></i> Edit Profile
                  </button>
                }
              </div>
            }

            <!-- Edit Profile -->
            @if (activeTab === 'edit-profile') {
              <div class="content-card">
                <div class="card-head">
                  <h2><i class="fas fa-pen"></i> Edit Profile</h2>
                </div>
                <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="luxury-form">
                  <div class="lf-group">
                    <label>Full Name *</label>
                    <input type="text" formControlName="name" placeholder="Your full name"
                      (keypress)="onlyText($event)" (input)="sanitizeText($event, profileForm, 'name')"
                      [class.lf-error]="profileForm.get('name')?.touched && profileForm.get('name')?.invalid">
                    @if (profileForm.get('name')?.touched && profileForm.get('name')?.errors?.['required']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Name is required</span>
                    }
                    @if (profileForm.get('name')?.touched && profileForm.get('name')?.errors?.['minlength']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Name must be at least 2 characters</span>
                    }
                    @if (profileForm.get('name')?.touched && profileForm.get('name')?.errors?.['pattern']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Name can only contain letters and spaces</span>
                    }
                  </div>
                  <div class="lf-group">
                    <label>Phone Number *</label>
                    <input type="tel" formControlName="phone" placeholder="10-digit phone number" maxlength="10"
                      (keypress)="onlyDigits($event)" (input)="sanitizeDigits($event, profileForm, 'phone')"
                      [class.lf-error]="profileForm.get('phone')?.touched && profileForm.get('phone')?.invalid">
                    @if (profileForm.get('phone')?.touched && profileForm.get('phone')?.errors?.['required']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Phone number is required</span>
                    }
                    @if (profileForm.get('phone')?.touched && profileForm.get('phone')?.errors?.['pattern']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Enter a valid 10-digit phone number</span>
                    }
                  </div>
                  <button type="submit" class="btn-luxury" [disabled]="profileForm.invalid">
                    <i class="fas fa-check"></i> Save Changes
                  </button>
                </form>
              </div>
            }

            <!-- Saved Address -->
            @if (activeTab === 'saved-address') {
              <div class="content-card">
                <div class="card-head">
                  <h2><i class="fas fa-map-marker-alt"></i> Saved Address</h2>
                  <p class="card-sub">Auto-filled at checkout for faster ordering</p>
                </div>
                <form [formGroup]="addressForm" (ngSubmit)="saveAddress()" class="luxury-form">
                  <div class="lf-group">
                    <label>Full Name *</label>
                    <input type="text" formControlName="fullName" placeholder="Recipient full name"
                      (keypress)="onlyText($event)" (input)="sanitizeText($event, addressForm, 'fullName')"
                      [class.lf-error]="addressForm.get('fullName')?.touched && addressForm.get('fullName')?.invalid">
                    @if (addressForm.get('fullName')?.touched && addressForm.get('fullName')?.errors?.['required']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Full name is required</span>
                    }
                  </div>
                  <div class="lf-group">
                    <label>Phone *</label>
                    <input type="tel" formControlName="phone" placeholder="10-digit phone" maxlength="10"
                      (keypress)="onlyDigits($event)" (input)="sanitizeDigits($event, addressForm, 'phone')"
                      [class.lf-error]="addressForm.get('phone')?.touched && addressForm.get('phone')?.invalid">
                    @if (addressForm.get('phone')?.touched && addressForm.get('phone')?.errors?.['required']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Phone is required</span>
                    }
                    @if (addressForm.get('phone')?.touched && addressForm.get('phone')?.errors?.['pattern']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Enter a valid 10-digit phone number</span>
                    }
                  </div>
                  <div class="lf-group">
                    <label>Address *</label>
                    <textarea formControlName="address" rows="3" placeholder="House no, Street, Area"
                      [class.lf-error]="addressForm.get('address')?.touched && addressForm.get('address')?.invalid"></textarea>
                    @if (addressForm.get('address')?.touched && addressForm.get('address')?.errors?.['required']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Address is required</span>
                    }
                    @if (addressForm.get('address')?.touched && addressForm.get('address')?.errors?.['minlength']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Address must be at least 10 characters</span>
                    }
                  </div>
                  <div class="lf-row">
                    <div class="lf-group">
                      <label>City *</label>
                      <input type="text" formControlName="city" placeholder="City"
                        (keypress)="onlyText($event)" (input)="sanitizeText($event, addressForm, 'city')"
                        [class.lf-error]="addressForm.get('city')?.touched && addressForm.get('city')?.invalid">
                      @if (addressForm.get('city')?.touched && addressForm.get('city')?.errors?.['required']) {
                        <span class="lf-err-msg"><i class="fas fa-info-circle"></i> City is required</span>
                      }
                    </div>
                    <div class="lf-group">
                      <label>State *</label>
                      <input type="text" formControlName="state" placeholder="State"
                        (keypress)="onlyText($event)" (input)="sanitizeText($event, addressForm, 'state')"
                        [class.lf-error]="addressForm.get('state')?.touched && addressForm.get('state')?.invalid">
                      @if (addressForm.get('state')?.touched && addressForm.get('state')?.errors?.['required']) {
                        <span class="lf-err-msg"><i class="fas fa-info-circle"></i> State is required</span>
                      }
                    </div>
                  </div>
                  <div class="lf-group">
                    <label>Pincode *</label>
                    <input type="text" formControlName="pincode" placeholder="6-digit pincode" maxlength="6"
                      (keypress)="onlyDigits($event)" (input)="sanitizeDigits($event, addressForm, 'pincode')"
                      [class.lf-error]="addressForm.get('pincode')?.touched && addressForm.get('pincode')?.invalid">
                    @if (addressForm.get('pincode')?.touched && addressForm.get('pincode')?.errors?.['required']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Pincode is required</span>
                    }
                    @if (addressForm.get('pincode')?.touched && addressForm.get('pincode')?.errors?.['pattern']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Enter a valid 6-digit pincode</span>
                    }
                  </div>
                  <button type="submit" class="btn-luxury" [disabled]="addressForm.invalid || addressLoading">
                    <i class="fas fa-save"></i> {{ addressLoading ? 'Saving...' : 'Save Address' }}
                  </button>
                </form>
              </div>
            }

            <!-- Change Password -->
            @if (activeTab === 'change-password') {
              <div class="content-card">
                <div class="card-head">
                  <h2><i class="fas fa-lock"></i> Change Password</h2>
                </div>
                @if (passwordSuccess) {
                  <div class="lux-alert success"><i class="fas fa-check-circle"></i> {{ passwordSuccess }}</div>
                }
                @if (passwordError) {
                  <div class="lux-alert error"><i class="fas fa-exclamation-circle"></i> {{ passwordError }}</div>
                }
                <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="luxury-form">
                  <div class="lf-group">
                    <label>Current Password *</label>
                    <input type="password" formControlName="currentPassword" placeholder="Enter current password"
                      [class.lf-error]="passwordForm.get('currentPassword')?.touched && passwordForm.get('currentPassword')?.invalid">
                    @if (passwordForm.get('currentPassword')?.touched && passwordForm.get('currentPassword')?.errors?.['required']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Current password is required</span>
                    }
                  </div>
                  <div class="lf-group">
                    <label>New Password *</label>
                    <input type="password" formControlName="newPassword" placeholder="Min. 6 characters"
                      [class.lf-error]="passwordForm.get('newPassword')?.touched && passwordForm.get('newPassword')?.invalid">
                    @if (passwordForm.get('newPassword')?.touched && passwordForm.get('newPassword')?.errors?.['required']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> New password is required</span>
                    }
                    @if (passwordForm.get('newPassword')?.touched && passwordForm.get('newPassword')?.errors?.['minlength']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Password must be at least 6 characters</span>
                    }
                    @if (passwordForm.get('newPassword')?.touched && passwordForm.get('newPassword')?.errors?.['pattern']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Must contain at least one letter and one number</span>
                    }
                  </div>
                  <div class="lf-group">
                    <label>Confirm New Password *</label>
                    <input type="password" formControlName="confirmPassword" placeholder="Repeat new password"
                      [class.lf-error]="passwordForm.get('confirmPassword')?.touched && (passwordForm.get('confirmPassword')?.invalid || passwordForm.errors?.['mismatch'])">
                    @if (passwordForm.get('confirmPassword')?.touched && passwordForm.get('confirmPassword')?.errors?.['required']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Please confirm your password</span>
                    }
                    @if (passwordForm.get('confirmPassword')?.touched && passwordForm.errors?.['mismatch']) {
                      <span class="lf-err-msg"><i class="fas fa-info-circle"></i> Passwords do not match</span>
                    }
                  </div>
                  <button type="submit" class="btn-luxury" [disabled]="passwordForm.invalid || passwordLoading">
                    <i class="fas fa-shield-alt"></i> {{ passwordLoading ? 'Updating...' : 'Update Password' }}
                  </button>
                </form>
              </div>
            }

          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ── Page ── */
    .dashboard-page { min-height: 100vh; background: var(--color-bg); padding-bottom: var(--spacing-4xl); }

    /* ── Hero Header ── */
    .dash-hero {
      background: linear-gradient(135deg, var(--color-forest) 0%, #0f2922 60%, var(--color-primary-dark) 100%);
      padding: var(--spacing-2xl) 0;
      margin-bottom: var(--spacing-2xl);
      position: relative;
      overflow: hidden;
    }
    .dash-hero::before {
      content: '';
      position: absolute;
      top: -60%; right: -10%;
      width: 500px; height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 65%);
      pointer-events: none;
    }
    .dash-hero-content { display: flex; align-items: center; gap: var(--spacing-xl); }
    .avatar {
      width: 72px; height: 72px; border-radius: 50%;
      background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-heading); font-size: 2rem; font-weight: 700; color: white;
      box-shadow: 0 4px 20px rgba(212,175,55,0.4);
      flex-shrink: 0;
    }
    .dash-welcome { font-size: var(--font-size-sm); color: rgba(255,255,255,0.6); letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 4px; }
    .dash-hero h1 { font-family: var(--font-heading); font-size: clamp(1.5rem, 3vw, 2.2rem); color: white; margin: 0 0 8px; font-weight: 700; }
    .dash-badge {
      display: inline-block; padding: 4px 14px;
      background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.4);
      border-radius: var(--radius-full); font-size: var(--font-size-xs);
      color: var(--color-secondary); letter-spacing: 0.08em; text-transform: uppercase;
    }

    /* ── Layout ── */
    .dashboard-layout { display: grid; grid-template-columns: 240px 1fr; gap: var(--spacing-xl); align-items: start; }

    /* ── Sidebar ── */
    .sidebar-nav {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border-light);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      display: flex; flex-direction: column;
    }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 20px;
      font-family: var(--font-body); font-size: var(--font-size-sm); font-weight: 500;
      color: var(--color-text-light);
      background: none; border: none; cursor: pointer; text-decoration: none;
      border-left: 3px solid transparent;
      transition: all 0.2s ease;
      text-align: left;
    }
    .nav-item:not(:last-child) { border-bottom: 1px solid var(--color-border-light); }
    .nav-item:hover { background: var(--color-ivory); color: var(--color-primary); border-left-color: var(--color-secondary); }
    .nav-item.active { background: linear-gradient(90deg, rgba(212,165,116,0.12), transparent); color: var(--color-primary); border-left-color: var(--color-secondary); font-weight: 600; }
    .nav-icon { width: 32px; height: 32px; border-radius: var(--radius-md); background: var(--color-bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .nav-item.active .nav-icon { background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark)); }
    .nav-item.active .nav-icon i { color: white; }
    .nav-icon i { font-size: 13px; color: var(--color-text-muted); }

    /* ── Content Card ── */
    .content-card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border-light);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }
    .card-head {
      padding: 20px 28px;
      border-bottom: 1px solid var(--color-border-light);
      background: linear-gradient(90deg, var(--color-ivory), white);
    }
    .card-head h2 {
      font-family: var(--font-heading); font-size: var(--font-size-xl);
      color: var(--color-primary); margin: 0;
      display: flex; align-items: center; gap: 10px;
    }
    .card-head h2 i { color: var(--color-secondary); font-size: 1rem; }
    .card-sub { font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 6px 0 0; letter-spacing: 0.03em; }

    /* ── Profile Grid ── */
    .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--color-border-light); margin: 0; }
    .profile-field { padding: 20px 28px; background: white; }
    .profile-field:hover { background: var(--color-ivory); }
    .field-label { display: block; font-size: var(--font-size-xs); text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-secondary); font-weight: 600; margin-bottom: 6px; }
    .field-value { display: block; font-family: var(--font-heading); font-size: var(--font-size-base); color: var(--color-text); font-weight: 500; }
    .btn-luxury {
      display: inline-flex; align-items: center; gap: 8px;
      margin: 20px 28px;
      padding: 11px 24px;
      background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
      color: white; border: none; border-radius: var(--radius-md);
      font-family: var(--font-body); font-size: var(--font-size-sm); font-weight: 600;
      cursor: pointer; letter-spacing: 0.05em; text-transform: uppercase;
      transition: all 0.3s ease;
      box-shadow: 0 4px 14px rgba(212,165,116,0.35);
    }
    .btn-luxury:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-glow); }
    .btn-luxury:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    /* ── Luxury Form ── */
    .luxury-form { padding: 24px 28px; display: flex; flex-direction: column; gap: 18px; }
    .lf-group { display: flex; flex-direction: column; gap: 6px; }
    .lf-group label {
      font-size: var(--font-size-xs); font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--color-text-light);
    }
    .lf-group input, .lf-group textarea {
      padding: 11px 14px;
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-md);
      font-family: var(--font-body); font-size: var(--font-size-sm);
      color: var(--color-text); background: var(--color-bg);
      transition: all 0.2s;
      width: 100%;
    }
    .lf-group input:focus, .lf-group textarea:focus {
      outline: none; border-color: var(--color-secondary);
      background: white; box-shadow: 0 0 0 3px rgba(212,165,116,0.15);
    }
    .lf-group input.lf-error, .lf-group textarea.lf-error { border-color: var(--color-error); box-shadow: 0 0 0 3px rgba(220,53,69,0.1); }
    .lf-err-msg { display: block; color: var(--color-error); font-size: 11px; margin-top: 4px; }
    .lf-err-msg i { margin-right: 4px; }
    .lf-group textarea { resize: vertical; min-height: 90px; }
    .lf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .luxury-form .btn-luxury { margin: 6px 0 0; align-self: flex-start; }

    /* ── Alerts ── */
    .lux-alert {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 28px; font-size: var(--font-size-sm);
    }
    .lux-alert.success { background: rgba(40,167,69,0.08); color: #155724; border-bottom: 1px solid rgba(40,167,69,0.15); }
    .lux-alert.error { background: rgba(220,53,69,0.08); color: #721c24; border-bottom: 1px solid rgba(220,53,69,0.15); }

    /* ── Responsive ── */
    @media (max-width: 992px) {
      .dashboard-layout { grid-template-columns: 200px 1fr; gap: var(--spacing-lg); }
    }
    @media (max-width: 768px) {
      .dashboard-layout { grid-template-columns: 1fr; }
      .sidebar-nav { flex-direction: row; flex-wrap: wrap; border-radius: var(--radius-lg); }
      .nav-item { flex: 1; min-width: 120px; justify-content: center; border-left: none; border-bottom: 3px solid transparent; padding: 12px 8px; font-size: var(--font-size-xs); }
      .nav-item:not(:last-child) { border-bottom: 3px solid transparent; border-right: 1px solid var(--color-border-light); }
      .nav-item.active { border-bottom-color: var(--color-secondary); border-left: none; }
      .nav-icon { display: none; }
      .profile-grid { grid-template-columns: 1fr; }
      .lf-row { grid-template-columns: 1fr; }
      .card-head, .luxury-form { padding: 16px 20px; }
      .profile-field { padding: 16px 20px; }
      .btn-luxury { margin: 16px 20px; }
    }
    @media (max-width: 480px) {
      .dash-hero { padding: var(--spacing-xl) 0; }
      .avatar { width: 56px; height: 56px; font-size: 1.5rem; }
      .nav-item span:last-child { display: none; }
      .nav-icon { display: flex; }
      .nav-item { min-width: unset; flex: 1; }
      .dash-hero h1 { font-size: 1.4rem; }
      .lf-group input, .lf-group textarea { font-size: 16px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthService);
  private orderService = inject(OrderService);
  private addressService = inject(AddressService);
  private ns = inject(NotificationService);
  private fb = inject(FormBuilder);

  activeTab = 'profile';
  orders: Order[] = [];
  loading = false;
  passwordLoading = false;
  addressLoading = false;
  passwordSuccess = '';
  passwordError = '';
  avatarFile: File | null = null;
  avatarPreview: string | null = null;

  profileForm = this.fb.group({
    name:  ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s\-']+$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
  });

  addressForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone:    ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    address:  ['', [Validators.required, Validators.minLength(10)]],
    city:     ['', Validators.required],
    state:    ['', Validators.required],
    pincode:  ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword:     ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)]],
    confirmPassword: ['', Validators.required]
  }, { validators: (g: AbstractControl): ValidationErrors | null => {
    const np = g.get('newPassword')?.value;
    const cp = g.get('confirmPassword')?.value;
    return np && cp && np !== cp ? { mismatch: true } : null;
  }});

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({ name: user.name, phone: user.phone });
    }
    this.loadOrders();
    this.loadAddress();
  }

  loadAddress(): void {
    this.addressService.getAddress().subscribe({
      next: (res) => { if (res.data?.fullName) this.addressForm.patchValue(res.data); },
      error: () => {}
    });
  }

  saveAddress(): void {
    if (this.addressForm.invalid) { this.addressForm.markAllAsTouched(); return; }
    this.addressLoading = true;
    this.addressService.saveAddress(this.addressForm.value as SavedAddress).subscribe({
      next: () => { this.ns.success('Address saved successfully'); this.addressLoading = false; },
      error: () => { this.ns.error('Failed to save address'); this.addressLoading = false; }
    });
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: (res: any) => { this.orders = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onAvatarSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.avatarFile = file;
    const reader = new FileReader();
    reader.onload = (e) => this.avatarPreview = e.target?.result as string;
    reader.readAsDataURL(file);
    this.authService.updateProfile({ name: this.profileForm.value.name || '', phone: this.profileForm.value.phone || '' }, file).subscribe({
      next: () => { this.ns.success('Profile photo updated'); this.avatarFile = null; },
      error: () => this.ns.error('Failed to upload photo')
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    this.authService.updateProfile(
      { name: this.profileForm.value.name!, phone: this.profileForm.value.phone! },
      this.avatarFile || undefined
    ).subscribe({
      next: () => { this.ns.success('Profile updated'); this.avatarFile = null; this.avatarPreview = null; },
      error: () => this.ns.error('Failed to update profile')
    });
  }

  getInitial(): string {
    return this.authService.currentUser()?.name?.charAt(0).toUpperCase() || 'U';
  }

  onlyText(e: KeyboardEvent): void {
    if (!/^[a-zA-Z\s]$/.test(e.key)) e.preventDefault();
  }
  onlyDigits(e: KeyboardEvent): void {
    if (!/^\d$/.test(e.key)) e.preventDefault();
  }
  sanitizeDigits(e: Event, form: any, ctrl: string): void {
    const el = e.target as HTMLInputElement;
    const max = parseInt(el.getAttribute('maxlength') || '10');
    const clean = el.value.replace(/\D/g, '').slice(0, max);
    if (el.value !== clean) { el.value = clean; }
    form.get(ctrl)?.setValue(clean);
  }

  sanitizeText(e: Event, form: any, ctrl: string): void {
    const el = e.target as HTMLInputElement;
    const clean = el.value.replace(/[^a-zA-Z\s]/g, '');
    if (el.value !== clean) { el.value = clean; form.get(ctrl)?.setValue(clean, { emitEvent: false }); }
  }

  changePassword(): void {
    this.passwordSuccess = '';
    this.passwordError = '';
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    this.passwordLoading = true;
    this.authService.changePassword({
      currentPassword: this.passwordForm.value.currentPassword!,
      newPassword: this.passwordForm.value.newPassword!
    }).subscribe({
      next: (res: any) => {
        this.passwordLoading = false;
        this.passwordSuccess = res.message || 'Password changed successfully!';
        this.passwordForm.reset();
      },
      error: (err: any) => {
        this.passwordLoading = false;
        this.passwordError = err.error?.message || 'Failed to change password. Please try again.';
      }
    });
  }
}
