import { Component, inject, OnInit, OnDestroy, HostListener, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
 
 
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="announcement-strip">
      <div class="strip-track">
        <span>🎉 Free Shipping on orders above ₹1999</span>
        <span>✨ New Arrivals: Lehengas & Gowns</span>
        <span>💎 Premium Quality Women's Ethnic Wear</span>
        <span>🛍️ Easy Returns within 7 Days</span>
        <span>🎉 Free Shipping on orders above ₹1999</span>
        <span>✨ New Arrivals: Lehengas & Gowns</span>
        <span>💎 Premium Quality Women's Ethnic Wear</span>
        <span>🛍️ Easy Returns within 7 Days</span>
      </div>
    </div>
    <header class="header" [class.scrolled]="isScrolled">
      <div class="container">
        <div class="header-content">
          <a routerLink="/" class="logo">
            <span class="logo-text">Liya</span>
            <span class="logo-sub">Creation</span>
          </a>

          <nav class="nav hide-tablet">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            <a routerLink="/products" routerLinkActive="active">All Products</a>
            <a routerLink="/products/category/Lehengas" routerLinkActive="active">Lehengas</a>
            <a routerLink="/products/category/saree" routerLinkActive="active">saree</a>
            <a routerLink="/products/category/Gowns" routerLinkActive="active">Gowns</a>
            <a routerLink="/products/category/Kurtis" routerLinkActive="active">Kurtis</a>
          </nav>

          <div class="header-actions">
            <!-- Wishlist Icon - Near Cart -->
            <a routerLink="/wishlist" class="action-link wishlist-link" title="Wishlist">
              <div class="action-icon">
                <i class="fas fa-heart"></i>
                @if (wishlistService.wishlistCount() > 0) {
                  <span class="badge" [attr.key]="wishlistService.wishlistCount()">{{ animWishlist }}</span>
                }
              </div>
              <span class="action-label hide-mobile">Wishlist</span>
            </a>

            <!-- Cart Icon -->
            <a routerLink="/cart" class="action-link cart-link" title="Cart">
              <div class="action-icon">
                <i class="fas fa-shopping-bag"></i>
                @if (cartService.cartCount() > 0) {
                  <span class="badge" [attr.key]="cartService.cartCount()">{{ animCart }}</span>
                }
              </div>
              <span class="action-label hide-mobile">Cart</span>
            </a>

            @if (authService.currentUser(); as user) {
              <div class="user-menu" (clickOutside)="closeDropdown()">
                <button class="user-btn" (click)="toggleDropdown($event)">
                  <i class="fas fa-user"></i>
                  <span class="hide-mobile">{{ user.name }}</span>
                  <i class="fas fa-chevron-down dropdown-arrow" [class.rotate]="isDropdownOpen"></i>
                </button>
                <div class="dropdown" [class.show]="isDropdownOpen">
                  @if (user.role === 'admin') {
                    <a routerLink="/admin/dashboard" (click)="closeDropdown()"><i class="fas fa-tachometer-alt"></i> Admin Panel</a>
                    <a routerLink="/admin/products" (click)="closeDropdown()"><i class="fas fa-cog"></i> Manage Products</a>
                    
                  } @else {
                    <a routerLink="/user/dashboard" (click)="closeDropdown()"><i class="fas fa-user-circle"></i> My Account</a>
                    <a routerLink="/user/orders" (click)="closeDropdown()"><i class="fas fa-box"></i> My Orders</a>
                    
                  }
                  <button (click)="logout(); closeDropdown()"><i class="fas fa-sign-out-alt"></i> Logout</button>
                </div>
              </div>
            } @else {
              <a routerLink="/auth/login" class="btn btn-primary btn-sm">Login</a>
            }
            
            <button class="mobile-menu-toggle" (click)="toggleMobileMenu()">
              <i class="fas" [class.fa-bars]="!mobileMenuOpen" [class.fa-times]="mobileMenuOpen"></i>
            </button>
          </div>
        </div>
      </div>
      
      @if (mobileMenuOpen) {
        <div class="mobile-overlay" (click)="closeMobileMenu()"></div>
        <div class="mobile-drawer">
          <div class="drawer-header">
            <div class="drawer-logo">
              <span class="logo-text">Liya</span>
              <span class="logo-sub">Creation</span>
            </div>
            <button class="drawer-close" (click)="closeMobileMenu()">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <nav class="drawer-nav">
            <div class="drawer-section-label">Navigation</div>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="closeMobileMenu()">
              <i class="fas fa-home"></i> Home
            </a>
            <a routerLink="/products" routerLinkActive="active" (click)="closeMobileMenu()">
              <i class="fas fa-th"></i> All Products
            </a>

            <div class="drawer-section-label">Categories</div>
            <a routerLink="/products/category/Lehengas" routerLinkActive="active" (click)="closeMobileMenu()">
              <i class="fas fa-angle-right"></i> Lehengas
            </a>
            <a routerLink="/products/category/saree" routerLinkActive="active" (click)="closeMobileMenu()">
              <i class="fas fa-angle-right"></i> Saree
            </a>
            <a routerLink="/products/category/Gowns" routerLinkActive="active" (click)="closeMobileMenu()">
              <i class="fas fa-angle-right"></i> Gowns
            </a>
            <a routerLink="/products/category/Kurtis" routerLinkActive="active" (click)="closeMobileMenu()">
              <i class="fas fa-angle-right"></i> Kurtis
            </a>

            <div class="drawer-section-label">My Account</div>
            <a routerLink="/wishlist" routerLinkActive="active" (click)="closeMobileMenu()">
              <i class="fas fa-heart"></i> Wishlist
              @if (wishlistService.wishlistCount() > 0) {
                <span class="drawer-badge">{{ wishlistService.wishlistCount() }}</span>
              }
            </a>
            <a routerLink="/cart" routerLinkActive="active" (click)="closeMobileMenu()">
              <i class="fas fa-shopping-bag"></i> Cart
              @if (cartService.cartCount() > 0) {
                <span class="drawer-badge">{{ cartService.cartCount() }}</span>
              }
            </a>

            @if (authService.currentUser(); as user) {
              @if (user.role === 'admin') {
                <a routerLink="/admin/dashboard" (click)="closeMobileMenu()">
                  <i class="fas fa-tachometer-alt"></i> Admin Panel
                </a>
                <a routerLink="/admin/products" (click)="closeMobileMenu()">
                  <i class="fas fa-cog"></i> Manage Products
                </a>
              } @else {
                <a routerLink="/user/dashboard" (click)="closeMobileMenu()">
                  <i class="fas fa-user-circle"></i> My Account
                </a>
                <a routerLink="/user/orders" (click)="closeMobileMenu()">
                  <i class="fas fa-box"></i> My Orders
                </a>
              }
              <button class="drawer-logout" (click)="logout(); closeMobileMenu()">
                <i class="fas fa-sign-out-alt"></i> Logout
              </button>
            } @else {
              <div class="drawer-auth">
                <a routerLink="/auth/login" class="drawer-login-btn" (click)="closeMobileMenu()">
                  <i class="fas fa-sign-in-alt"></i> Login
                </a>
                <a routerLink="/auth/register" class="drawer-register-btn" (click)="closeMobileMenu()">
                  <i class="fas fa-user-plus"></i> Sign Up
                </a>
              </div>
            }
          </nav>
        </div>
      }
    </header>
  `,
  styles: [`
    .announcement-strip {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1001;
      background: linear-gradient(135deg, var(--color-primary) 0%, #A52A2A 100%);
      color: white;
      height: 36px;
      overflow: hidden;
      display: flex;
      align-items: center;
    }

    .strip-track {
      display: flex;
      gap: 60px;
      white-space: nowrap;
      animation: marquee 25s linear infinite;
      font-size: 0.78rem;
      font-weight: 500;
      letter-spacing: 0.04em;
    }

    .strip-track span {
      flex-shrink: 0;
    }

    @keyframes marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .header {
      position: fixed;
      top: 36px;
      left: 0;
      right: 0;
      z-index: 1000;
      background: transparent;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .header.scrolled {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border-bottom: 1px solid rgba(212, 175, 55, 0.15);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
    }

    .header.scrolled .logo-text {
      color: var(--color-primary);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.9rem 0;
      gap: 2rem;
    }

    .logo {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    .logo:hover {
      transform: scale(1.02);
    }

    .logo-text {
      font-family: var(--font-heading);
      font-size: 1.85rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--color-primary) 0%, #A52A2A 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 2px 10px rgba(139, 0, 0, 0.1);
    }

    .logo-sub {
      font-family: var(--font-body);
      font-size: 0.6rem;
      color: var(--color-secondary);
      letter-spacing: 0.4em;
      text-transform: uppercase;
      font-weight: 600;
    }

    .nav {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .nav a {
      font-family: var(--font-body);
      font-size: 0.8rem;
      font-weight: 500;
      color: #333;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 0.6rem 1rem;
      position: relative;
      transition: all 0.3s ease;
      border-radius: 6px;
    }

    .nav a::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--color-secondary), #D4AF37);
      transition: width 0.3s ease;
      border-radius: 2px;
    }

    .nav a:hover, .nav a.active {
      color: var(--color-primary);
      background: rgba(212, 175, 55, 0.08);
    }

    .nav a:hover::after, .nav a.active::after {
      width: 50%;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* Action Links - Wishlist & Cart - Premium Style */
    .action-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 50px;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: rgba(255,255,255,0.15);
      border: 1px solid transparent;
    }

    .action-link:hover {
      background: rgba(255, 255, 255, 0.95);
      border-color: rgba(212, 175, 55, 0.3);
      box-shadow: 0 4px 20px rgba(212, 175, 55, 0.15);
      transform: translateY(-2px);
    }

    .action-icon {
      position: relative;
      font-size: 1.25rem;
      color: #333;
      transition: all 0.3s ease;
    }

    .action-icon .badge {
      position: absolute;
      top: -8px;
      right: -8px;
      min-width: 20px;
      height: 20px;
      padding: 0 5px;
      background: linear-gradient(135deg, var(--color-secondary), #C9A227);
      color: white;
      font-size: 0.65rem;
      font-weight: 700;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
      animation: badgePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes badgePop {
      0%   { transform: scale(0); opacity: 0; }
      60%  { transform: scale(1.3); }
      100% { transform: scale(1); opacity: 1; }
    }

    .action-label {
      font-family: var(--font-body);
      font-size: 0.8rem;
      font-weight: 500;
      color: #333;
      letter-spacing: 0.03em;
    }

    .action-link:hover .action-icon {
      color: var(--color-primary);
      transform: scale(1.15);
    }

    /* Wishlist - Prominent Heart Icon */
    .wishlist-link .action-icon {
      font-size: 1.35rem;
    }
    
    .wishlist-link:hover .action-icon {
      color: #c0392b !important;
    }

    /* Cart */
    .cart-link .action-icon {
      font-size: 1.2rem;
    }

    /* User Menu - Premium Style */
    .user-menu {
      position: relative;
    }

    .user-btn {
      
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
      font-family: var(--font-body);
      font-size: 0.85rem;
      color: #333;
      padding: 10px 16px;
      border-radius: 50px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: rgba(255,255,255,0.15);
      border: 1px solid transparent;
    }

    .user-btn:hover {
      background: rgba(255, 255, 255, 0.95);
      border-color: rgba(212, 175, 55, 0.3);
      box-shadow: 0 4px 20px rgba(212, 175, 55, 0.15);
      color: var(--color-primary);
      transform: translateY(-2px);
    }

    .dropdown {
      display: none;
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      background: white;
      box-shadow: 0 25px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(212, 175, 55, 0.1);
      border-radius: 16px;
      min-width: 220px;
      padding: 0.5rem 0;
      z-index: 100;
      animation: fadeInDown 0.3s ease;
    }

    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dropdown a, .dropdown button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.8rem 1.25rem;
      text-align: left;
      background: none;
      border: none;
      cursor: pointer;
      font-family: var(--font-body);
      font-size: 0.875rem;
      color: #444;
      text-decoration: none;
      transition: all 0.25s ease;
    }

    .dropdown a i, .dropdown button i {
      width: 18px;
      color: var(--color-secondary);
      transition: color 0.25s ease;
    }

    .dropdown a:hover, .dropdown button:hover {
      background: linear-gradient(90deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.03) 100%);
      color: var(--color-primary);
      padding-left: 1.5rem;
    }

    .dropdown a:hover i, .dropdown button:hover i {
      color: var(--color-primary);
    }

    .dropdown.show {
      display: block;
    }

    .dropdown-arrow {
      font-size: 0.7rem;
      transition: transform 0.3s ease;
    }

    .dropdown-arrow.rotate {
      transform: rotate(180deg);
    }

    /* Mobile Menu Toggle */
    .mobile-menu-toggle {
      display: none;
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(212, 175, 55, 0.2);
      font-size: 1.4rem;
      color: #333;
      cursor: pointer;
      padding: 10px 12px;
      border-radius: 10px;
      transition: all 0.3s ease;
    }
    .mobile-menu-toggle:hover {
      background: rgba(255, 255, 255, 0.9);
      border-color: var(--color-secondary);
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
    }

    /* Overlay */
    .mobile-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1100;
      animation: fadeIn 0.25s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    /* Drawer */
    .mobile-drawer {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 300px;
      max-width: 85vw;
      background: white;
      z-index: 1101;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      animation: slideIn 0.3s cubic-bezier(0.4,0,0.2,1);
      box-shadow: 4px 0 30px rgba(0,0,0,0.15);
    }
    @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 16px;
      border-bottom: 1px solid rgba(212,175,55,0.15);
      background: linear-gradient(135deg, var(--color-primary) 0%, #8B1A1A 100%);
    }
    .drawer-logo { display: flex; flex-direction: column; line-height: 1.2; }
    .drawer-logo .logo-text { font-family: var(--font-heading); font-size: 1.6rem; font-weight: 700; color: white; }
    .drawer-logo .logo-sub { font-size: 0.55rem; color: var(--color-secondary); letter-spacing: 0.35em; text-transform: uppercase; }
    .drawer-close {
      width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3);
      background: rgba(255,255,255,0.15); color: white; font-size: 1rem;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .drawer-close:hover { background: rgba(255,255,255,0.3); }

    .drawer-nav {
      display: flex;
      flex-direction: column;
      padding: 12px 0 24px;
      flex: 1;
    }
    .drawer-section-label {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--color-secondary);
      padding: 14px 20px 6px;
    }
    .drawer-nav a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      font-size: 0.95rem;
      color: #333;
      text-decoration: none;
      border-left: 3px solid transparent;
      transition: all 0.2s;
    }
    .drawer-nav a i { width: 18px; color: var(--color-secondary); font-size: 0.9rem; }
    .drawer-nav a:hover, .drawer-nav a.active {
      background: linear-gradient(90deg, rgba(212,175,55,0.1), transparent);
      color: var(--color-primary);
      border-left-color: var(--color-secondary);
    }
    .drawer-nav a:hover i, .drawer-nav a.active i { color: var(--color-primary); }

    .drawer-badge {
      margin-left: auto;
      min-width: 20px; height: 20px;
      background: linear-gradient(135deg, var(--color-secondary), #C9A227);
      color: white; font-size: 0.65rem; font-weight: 700;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      padding: 0 5px;
    }

    .drawer-logout {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 20px; width: 100%;
      background: none; border: none; border-left: 3px solid transparent;
      font-size: 0.95rem; color: var(--color-error); cursor: pointer;
      transition: all 0.2s; text-align: left;
    }
    .drawer-logout i { width: 18px; font-size: 0.9rem; }
    .drawer-logout:hover { background: rgba(220,53,69,0.06); border-left-color: var(--color-error); }

    .drawer-auth {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px 20px;
    }
    .drawer-login-btn, .drawer-register-btn {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px; border-radius: 10px;
      font-size: 0.9rem; font-weight: 600; text-decoration: none;
      transition: all 0.2s;
    }
    .drawer-login-btn {
      background: linear-gradient(135deg, var(--color-primary), #8B1A1A);
      color: white;
    }
    .drawer-login-btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .drawer-register-btn {
      background: transparent;
      border: 2px solid var(--color-secondary);
      color: var(--color-primary);
    }
    .drawer-register-btn:hover { background: rgba(212,175,55,0.08); transform: translateY(-1px); }

    /* Theme Toggle */
    .theme-toggle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid rgba(212,175,55,0.3);
      background: rgba(255,255,255,0.15);
      color: #333;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }
    .theme-toggle:hover {
      background: rgba(255,255,255,0.9);
      border-color: var(--color-secondary);
      color: var(--color-primary);
      transform: rotate(20deg) scale(1.1);
    }
    [data-theme="dark"] .theme-toggle { color: #F0EDE8; background: rgba(255,255,255,0.1); }
    .btn-primary {
      background: linear-gradient(135deg, var(--color-secondary), #C9A227) !important;
      color: white !important;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 50px;
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(212, 175, 55, 0.4);
    }

    /* Responsive */
    @media (max-width: 992px) {
      .nav { display: none; }
      .mobile-menu-toggle { display: block; }
      .mobile-menu { display: block; }
      .action-label { display: none; }
    }

    @media (max-width: 576px) {
      .announcement-strip {
        height: 28px;
        min-height: 28px;
      }

      .logo .logo-text { font-size: 1.6rem; }
      .header-content { padding: 0.65rem 0; }
      .header-actions { gap: 4px; }
      .action-link { padding: 6px 8px; }
      .user-btn { padding: 6px 8px; font-size: 0.8rem; }
      .btn-primary { padding: 6px 12px; font-size: 0.8rem; }
      .mobile-menu { padding: 0.75rem; }
      .mobile-nav a { padding: 0.75rem; font-size: 0.9rem; }
    }

    @media (max-width: 380px) {
      .action-link { padding: 6px 8px; gap: 4px; }
      .logo .logo-text { font-size: 1.35rem; }
      .mobile-menu-toggle { padding: 6px 8px; font-size: 1.2rem; }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  private router = inject(Router);
  mobileMenuOpen = false;
  isScrolled = false;
  isDropdownOpen = false;

  animCart = 0;
  animWishlist = 0;
  private cartTimer: any;
  private wishlistTimer: any;

  private animateTo(target: number, current: number, setter: (v: number) => void, timerRef: { t: any }): void {
    clearInterval(timerRef.t);
    let val = 0;
    const steps = Math.max(target, 10);
    const stepTime = 600 / steps;
    timerRef.t = setInterval(() => {
      val++;
      setter(val);
      if (val >= target) clearInterval(timerRef.t);
    }, stepTime);
  }

  constructor() {
    const cartRef = { t: null as any };
    const wishRef = { t: null as any };
    effect(() => {
      const count = this.cartService.cartCount();
      this.animateTo(count, this.animCart, v => this.animCart = v, cartRef);
    });
    effect(() => {
      const count = this.wishlistService.wishlistCount();
      this.animateTo(count, this.animWishlist, v => this.animWishlist = v, wishRef);
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const userMenu = document.querySelector('.user-menu');
    
    if (userMenu && !userMenu.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Navigate to home page after successful logout
        this.router.navigate(['/']);
      },
      error: () => {
        // Even on error, navigate to home page
        this.router.navigate(['/']);
      }
    });
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.mobileMenuOpen && window.innerWidth > 992) {
      this.closeMobileMenu();
    }
  }
}
