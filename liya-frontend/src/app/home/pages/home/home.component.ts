import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductService, Product } from '../../../core/services/product.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { PremiumProductCardComponent, PremiumProduct } from '../../../shared/components/premium-product-card/premium-product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PremiumProductCardComponent],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-background"></div>
      <div class="hero-content">
        <span class="hero-tagline">Premium Ethnic Wear</span>
        <h1>Discover Elegance in Every Thread</h1>
        <p>Curated collection of Lehengas, sarees, Gowns, and Kurtis crafted with timeless artistry</p>
        <div class="hero-actions">
          <a routerLink="/products" class="btn btn-primary btn-lg">Shop Collection</a>
          <a routerLink="/products" [queryParams]="{newArrivals: true}" class="btn btn-outline-light btn-lg">New Arrivals</a>
        </div>
      </div>
      <div class="hero-scroll">
        <span>Scroll to explore</span>
        <i class="fas fa-chevron-down"></i>
      </div>
    </section>

    <!-- Trust Badges -->
    <section class="trust-badges">
      <div class="container">
        <div class="badges-grid">
          <div class="badge">
            <i class="fas fa-gem"></i>
            <div class="badge-text">
              <h4>Premium Quality</h4>
              <p>Finest fabrics & craftsmanship</p>
            </div>
          </div>
          <div class="badge">
            <i class="fas fa-shipping-fast"></i>
            <div class="badge-text">
              <h4>Free Shipping</h4>
              <p>On orders above ₹1,999</p>
            </div>
          </div>
          <div class="badge">
            <i class="fas fa-undo"></i>
            <div class="badge-text">
              <h4>Easy Returns</h4>
              <p>30-day return policy</p>
            </div>
          </div>
          <div class="badge">
            <i class="fas fa-headset"></i>
            <div class="badge-text">
              <h4>24/7 Support</h4>
              <p>Dedicated assistance</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section - Premium Style -->
    <section class="categories-premium">
      <div class="premium-header">
        <span class="premium-tag">Discover</span>
        <h2 class="premium-title">Shop by Category</h2>
        <p class="premium-subtitle">Explore our exquisite collection of ethnic wear</p>
      </div>

      <div class="premium-category-track">
        <!-- Lehengas - Featured -->
        <a routerLink="/products/category/Lehengas" class="premium-category-card">
          <div class="premium-card-image">
            <img src="https://image2url.com/r2/default/images/1772724921023-fc626839-5f03-4d03-b784-bd13a0fd0c8f.webp" alt="Lehengas" loading="lazy">
            <div class="premium-overlay"></div>
            <span class="premium-badge">HOT🔥</span>
          </div>
          <div class="premium-card-content">
            <h3>Lehengas</h3>
            <p>Traditional elegance for special occasions</p>
            <span class="explore-link">Explore Collection <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>
          </div>
          <div class="shimmer-effect"></div>
        </a>

        <!-- saree -->
        <a routerLink="/products/category/saree" class="premium-category-card">
          <div class="premium-card-image">
            <img src="https://image2url.com/r2/default/images/1772725371377-3b17738a-52c0-4181-bff3-ede3c16e4585.webp" alt="saree" loading="lazy">
            <div class="premium-overlay"></div>
             <span class="premium-badge">NEW🔥</span>
          </div>
          <div class="premium-card-content">
            <h3>sarees</h3>
            <p>Timeless beauty with modern touch</p>
            <span class="explore-link">Explore Collection <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>
          </div>
          <div class="shimmer-effect"></div>
        </a>

        <!-- Gowns -->
        <a routerLink="/products/category/Gowns" class="premium-category-card">
          <div class="premium-card-image">
            <img src="https://image2url.com/r2/default/images/1772725409626-9448ac96-e9e7-45e7-b6ea-d4f5abfd64d3.webp" alt="Gowns" loading="lazy">
            <div class="premium-overlay"></div>
            
          </div>
          <div class="premium-card-content">
            <h3>Gowns</h3>
            <p>Graceful silhouettes for grand events</p>
            <span class="explore-link">Explore Collection <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>
          </div>
          <div class="shimmer-effect"></div>
        </a>

        <!-- Kurtis -->
        <a routerLink="/products/category/Kurtis" class="premium-category-card">
          <div class="premium-card-image">
            <img src="https://image2url.com/r2/default/images/1772725428118-de60405b-ffab-41c3-99ee-ce6f28bf3fcb.webp" alt="Kurtis" loading="lazy">
            <div class="premium-overlay"></div>
           
          </div>
          <div class="premium-card-content">
            <h3>Kurtis</h3>
            <p>Effortless elegance for everyday grace</p>
            <span class="explore-link">Explore Collection <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>
          </div>
          <div class="shimmer-effect"></div>
        </a>

      </div>
    </section>

    <!-- Featured Products - Using Premium Product Cards -->
    <section class="featured section">
      <div class="container">
        <div class="section-header">
          <span class="section-subtitle">Handpicked</span>
          <h2 class="section-title">Featured Products</h2>
          <p class="section-description">Our most loved pieces, chosen just for you</p>
        </div>
        @if (loading) {
          <div class="loading">Loading...</div>
        } @else {
          <div class="products-grid">
            @for (product of featuredProducts; track product._id) {
              <app-premium-product-card
                [product]="convertToPremiumProduct(product)"
                [colorTheme]="getColorTheme(product)"
                (quickView)="onQuickView($event)"
                (addToCart)="onAddToCart($event)"
              />
            }
          </div>
        }
        <div class="view-all">
          <a routerLink="/products" class="btn btn-outline">View All Products</a>
        </div>
      </div>
    </section>

    <!-- New Arrivals -->
    @if (newArrivals.length > 0) {
      <section class="new-arrivals section">
        <div class="container">
          <div class="section-header">
            <span class="section-subtitle">Just In</span>
            <h2 class="section-title">New Arrivals</h2>
            <p class="section-description">Fresh styles added to our collection</p>
          </div>
          <div class="products-grid">
            @for (product of newArrivals; track product._id) {
              <app-premium-product-card
                [product]="convertToPremiumProduct(product)"
                [colorTheme]="getColorTheme(product)"
                (quickView)="onQuickView($event)"
                (addToCart)="onAddToCart($event)"
              />
            }
          </div>
          <div class="view-all">
            <a routerLink="/products" [queryParams]="{newArrivals: true}" class="btn btn-outline">View All New Arrivals</a>
          </div>
        </div>
      </section>
    }

    <!-- Banner Section -->
    <section class="promo-banner">
      <div class="container">
        <div class="promo-content">
          <span class="promo-tag">Exclusive Offer</span>
          <h2>Flat 20% Off</h2>
          <p>On all Lehengas & sarees for a limited time</p>
          <a routerLink="/products/category/Lehengas" class="btn btn-primary">Shop Now</a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features section">
      <div class="container">
        <div class="features-grid">
          <div class="feature">
            <div class="feature-icon">
              <i class="fas fa-shipping-fast"></i>
            </div>
            <h3>Free Shipping</h3>
            <p>On all orders above ₹1,999 across India</p>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <i class="fas fa-undo"></i>
            </div>
            <h3>Easy Returns</h3>
            <p>30-day hassle-free return policy</p>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <i class="fas fa-headset"></i>
            </div>
            <h3>24/7 Support</h3>
            <p>Dedicated customer support team</p>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <i class="fas fa-lock"></i>
            </div>
            <h3>Secure Payment</h3>
            <p>100% secure transactions</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero { position: relative; height: 100vh; min-height: 700px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .hero-background { position: absolute; inset: 0; background: url('https://cdn.phototourl.com/uploads/2026-03-05-66226a02-3b43-42a0-8a1d-d0a71157f598.png') center/cover no-repeat; transform: scale(1.1); animation: heroZoom 20s ease-in-out infinite alternate; }
    @keyframes heroZoom { from { transform: scale(1.1); } to { transform: scale(1.2); } }
    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(139, 0, 0, 0.85) 0%, rgba(26, 60, 52, 0.75) 50%, rgba(139, 0, 0, 0.8) 100%); }
    .hero-content { position: relative; z-index: 2; text-align: center; color: white; max-width: 800px; padding: var(--spacing-xl); animation: fadeInUp 1s ease-out; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .hero-tagline { display: inline-block; font-family: var(--font-body); font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); letter-spacing: var(--letter-spacing-widest); text-transform: uppercase; color: var(--color-secondary); margin-bottom: var(--spacing-lg); padding: var(--spacing-sm) var(--spacing-lg); border: 1px solid var(--color-secondary); border-radius: var(--radius-full); }
    .hero-content h1 { font-family: var(--font-heading); font-size: clamp(2.5rem, 5vw, 4rem); font-weight: var(--font-weight-bold); color: white; margin-bottom: var(--spacing-lg); line-height: 1.2; }
    .hero-content p { font-size: var(--font-size-lg); color: rgba(255, 255, 255, 0.9); margin-bottom: var(--spacing-2xl); max-width: 600px; margin-left: auto; margin-right: auto; }
    .hero-actions { display: flex; gap: var(--spacing-lg); justify-content: center; flex-wrap: wrap; }
    .btn-outline-light { background: transparent; border: 2px solid white; color: white; &:hover { background: white; color: var(--color-primary); } }
    .hero-scroll { position: absolute; bottom: var(--spacing-xl); left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: var(--spacing-sm); color: rgba(255, 255, 255, 0.7); font-size: var(--font-size-xs); text-transform: uppercase; letter-spacing: var(--letter-spacing-wider); animation: bounce 2s infinite; }
    @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); } 40% { transform: translateX(-50%) translateY(-10px); } 60% { transform: translateX(-50%) translateY(-5px); } }

    /* Trust Badges */
    .trust-badges { background: var(--color-forest); padding: var(--spacing-xl) 0; margin-top: -1px; }
    .badges-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-lg); }
    .badge { display: flex; align-items: center; gap: var(--spacing-md); i { font-size: 1.75rem; color: var(--color-secondary); } h4 { font-family: var(--font-heading); font-size: var(--font-size-sm); color: white; margin: 0; } p { font-size: var(--font-size-xs); color: rgba(255, 255, 255, 0.7); margin: 0; } }

    /* Section Styles */
    .section { padding: var(--spacing-4xl) 0; }
    .section-header { text-align: center; margin-bottom: var(--spacing-2xl); }
    .section-subtitle { display: inline-block; font-family: var(--font-body); font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); letter-spacing: var(--letter-spacing-widest); text-transform: uppercase; color: var(--color-secondary); margin-bottom: var(--spacing-sm); }
    .section-title { font-family: var(--font-heading); font-size: var(--font-size-4xl); color: var(--color-text); margin-bottom: var(--spacing-md); }
    .section-description { font-size: var(--font-size-base); color: var(--color-text-light); max-width: 500px; margin: 0 auto; }

    /* ============================================
       LUXURY CATEGORIES SECTION
       ============================================ */
    .categories-premium {
      padding: 100px 0 80px;
      background:
        linear-gradient(180deg, #faf7f2 0%, #fff9f4 40%, #faf7f2 100%);
      position: relative;
      overflow: hidden;
    }

    /* Decorative corner ornaments */
    .categories-premium::before,
    .categories-premium::after {
      content: '';
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      pointer-events: none;
    }
    .categories-premium::before {
      top: -200px; left: -150px;
      background: radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 65%);
    }
    .categories-premium::after {
      bottom: -200px; right: -150px;
      background: radial-gradient(circle, rgba(139,0,0,0.08) 0%, transparent 65%);
    }

    /* ---- Header ---- */
    .premium-header {
      text-align: center;
      margin-bottom: 56px;
      position: relative;
      z-index: 1;
    }

    .premium-tag {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-body);
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #C9A84C;
      margin-bottom: 18px;
      padding: 8px 22px;
      border: 1px solid rgba(212,175,55,0.45);
      border-radius: 40px;
      background: rgba(212,175,55,0.07);
      backdrop-filter: blur(4px);
    }
    .premium-tag::before,
    .premium-tag::after {
      content: '✦';
      font-size: 0.55rem;
      opacity: 0.7;
    }

    .premium-title {
      font-family: var(--font-heading);
      font-size: clamp(2rem, 4vw, 3.2rem);
      font-weight: 700;
      color: #8B0000;
      margin: 0 0 14px;
      letter-spacing: -0.01em;
      line-height: 1.15;
    }

    /* gold divider under title */
    .premium-title::after {
      content: '';
      display: block;
      width: 60px;
      height: 2px;
      margin: 14px auto 0;
      background: linear-gradient(90deg, transparent, #D4AF37, transparent);
      border-radius: 2px;
    }

    .premium-subtitle {
      font-family: var(--font-body);
      font-size: 1rem;
      color: #8a7a6a;
      margin: 0;
      font-weight: 400;
      letter-spacing: 0.04em;
    }

    /* ---- Track ---- */
    .premium-category-track {
      display: flex;
      gap: 28px;
      padding: 24px 60px 36px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      -ms-overflow-style: none;
      position: relative;
      z-index: 1;
      /* fade edges */
      -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 5%, #000 95%, transparent 100%);
      mask-image: linear-gradient(90deg, transparent 0%, #000 5%, #000 95%, transparent 100%);
    }
    .premium-category-track::-webkit-scrollbar { display: none; }

    /* ---- Card ---- */
    .premium-category-card {
      position: relative;
      flex: 0 0 300px;
      height: 420px;
      border-radius: 20px;
      overflow: hidden;
      text-decoration: none;
      scroll-snap-align: start;
      transition: transform 0.55s cubic-bezier(0.22,1,0.36,1),
                  box-shadow 0.55s cubic-bezier(0.22,1,0.36,1);
      /* gold border via outline trick */
      outline: 1px solid rgba(212,175,55,0.18);
      box-shadow:
        0 4px 24px rgba(0,0,0,0.10),
        0 1px 4px rgba(0,0,0,0.06),
        inset 0 0 0 1px rgba(255,255,255,0.12);
    }

    .premium-category-card:hover {
      transform: translateY(-16px) scale(1.025);
      outline-color: rgba(212,175,55,0.55);
      box-shadow:
        0 32px 64px rgba(0,0,0,0.18),
        0 8px 24px rgba(0,0,0,0.10),
        0 0 0 1px rgba(212,175,55,0.35),
        0 0 40px rgba(212,175,55,0.18);
    }

    /* ---- Image ---- */
    .premium-card-image {
      position: absolute;
      inset: 0;
    }
    .premium-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.7s cubic-bezier(0.22,1,0.36,1);
      filter: saturate(1.05) brightness(0.96);
    }
    .premium-category-card:hover .premium-card-image img {
      transform: scale(1.10);
      filter: saturate(1.12) brightness(1.0);
    }

    /* ---- Overlay ---- */
    .premium-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        170deg,
        rgba(20,8,8,0.05)  0%,
        rgba(80,10,10,0.25) 45%,
        rgba(10,30,20,0.82) 100%
      );
      transition: background 0.5s ease;
    }
    .premium-category-card:hover .premium-overlay {
      background: linear-gradient(
        170deg,
        rgba(20,8,8,0.15)  0%,
        rgba(100,10,10,0.40) 45%,
        rgba(10,30,20,0.92) 100%
      );
    }

    /* ---- Badge ---- */
    .premium-badge {
      position: absolute;
      top: 18px;
      left: 18px;
      background: linear-gradient(135deg, #D4AF37 0%, #f0d060 50%, #B8962E 100%);
      color: #3a2800;
      padding: 5px 13px;
      border-radius: 6px;
      font-family: var(--font-body);
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      z-index: 10;
      box-shadow: 0 4px 16px rgba(212,175,55,0.50), 0 1px 3px rgba(0,0,0,0.2);
    }

    /* ---- Content panel (glassmorphism) ---- */
    .premium-card-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0 26px 26px;
      z-index: 10;
    }

    /* glass pill that slides up */
    .premium-card-content::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 0 0 20px 20px;
      background: linear-gradient(
        180deg,
        rgba(255,255,255,0.0) 0%,
        rgba(255,255,255,0.06) 100%
      );
      backdrop-filter: blur(0px);
      transition: backdrop-filter 0.5s ease;
      pointer-events: none;
    }
    .premium-category-card:hover .premium-card-content::before {
      backdrop-filter: blur(6px);
    }

    .premium-card-content h3 {
      font-family: var(--font-heading);
      font-size: 1.55rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 6px;
      letter-spacing: 0.04em;
      text-shadow: 0 2px 12px rgba(0,0,0,0.4);
      transform: translateY(18px);
      transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
    }
    .premium-category-card:hover .premium-card-content h3 {
      transform: translateY(0);
    }

    /* thin gold rule under title */
    .premium-card-content h3::after {
      content: '';
      display: block;
      width: 0;
      height: 1px;
      margin-top: 8px;
      background: linear-gradient(90deg, #D4AF37, transparent);
      transition: width 0.45s ease 0.1s;
    }
    .premium-category-card:hover .premium-card-content h3::after {
      width: 50px;
    }

    .premium-card-content p {
      font-family: var(--font-body);
      font-size: 0.82rem;
      color: rgba(255,255,255,0.78);
      margin: 0 0 14px;
      font-weight: 400;
      letter-spacing: 0.02em;
      opacity: 0;
      transform: translateY(12px);
      transition: opacity 0.4s ease 0.08s, transform 0.4s ease 0.08s;
    }
    .premium-category-card:hover .premium-card-content p {
      opacity: 1;
      transform: translateY(0);
    }

    /* ---- Explore link ---- */
    .explore-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-body);
      font-size: 0.72rem;
      font-weight: 600;
      color: #D4AF37;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      opacity: 0;
      transform: translateX(-8px);
      transition: opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s;
      padding-bottom: 2px;
      border-bottom: 1px solid rgba(212,175,55,0.35);
    }
    .explore-link svg {
      width: 14px; height: 14px;
      transition: transform 0.3s ease;
    }
    .premium-category-card:hover .explore-link {
      opacity: 1;
      transform: translateX(0);
    }
    .premium-category-card:hover .explore-link svg {
      transform: translateX(5px);
    }

    /* ---- Shimmer border on hover ---- */
    .shimmer-effect {
      position: absolute;
      inset: 0;
      border-radius: 20px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.4s ease;
      overflow: hidden;
    }
    .shimmer-effect::after {
      content: '';
      position: absolute;
      top: -60%;
      left: -60%;
      width: 60%;
      height: 220%;
      background: linear-gradient(
        105deg,
        transparent 30%,
        rgba(255,255,255,0.18) 50%,
        transparent 70%
      );
      animation: shimmerSweep 1.8s ease-in-out infinite;
    }
    .premium-category-card:hover .shimmer-effect {
      opacity: 1;
    }
    @keyframes shimmerSweep {
      0%   { transform: translateX(-100%) rotate(0deg); }
      100% { transform: translateX(400%) rotate(0deg); }
    }

    /* ---- Responsive ---- */
    @media (max-width: 992px) {
      .premium-category-track { padding: 16px 32px 28px; gap: 20px; }
      .premium-category-card { flex: 0 0 250px; height: 360px; }
    }
    @media (max-width: 576px) {
      .categories-premium { padding: 60px 0 50px; }
      .premium-category-track { padding: 12px 20px 24px; gap: 16px;
        -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 3%, #000 97%, transparent 100%);
        mask-image: linear-gradient(90deg, transparent 0%, #000 3%, #000 97%, transparent 100%);
      }
      .premium-category-card { flex: 0 0 210px; height: 310px; border-radius: 16px; }
      .premium-card-content { padding: 0 18px 20px; }
      .premium-card-content h3 { font-size: 1.2rem; }
    }

    /* Categories */
    .category-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-lg); }
    .category-card { position: relative; overflow: hidden; border-radius: var(--radius-xl); text-decoration: none; &.category-card-lg { grid-row: span 2; } .category-image { position: relative; overflow: hidden; img { width: 100%; height: 280px; object-fit: cover; transition: transform var(--transition-slow); } &.category-card-lg img { height: 100%; min-height: 580px; } } .category-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%); } .category-content { position: absolute; bottom: 0; left: 0; right: 0; padding: var(--spacing-xl); color: white; h3 { font-family: var(--font-heading); font-size: var(--font-size-2xl); color: white; margin-bottom: var(--spacing-sm); } .category-link { font-size: var(--font-size-sm); color: var(--color-secondary); opacity: 0; transform: translateX(-10px); transition: all var(--transition-smooth); display: flex; align-items: center; gap: var(--spacing-sm); } } &:hover { .category-image img { transform: scale(1.1); } .category-content { transform: translateY(0); } .category-link { opacity: 1; transform: translateX(0); } } }

    /* New Arrivals */
    .new-arrivals { background: var(--color-ivory); }
    .new-arrivals .section-subtitle { color: var(--color-primary); }
    .new-arrivals .section-title::after { background: linear-gradient(90deg, transparent, var(--color-primary), transparent); }

    .view-all { text-align: center; margin-top: var(--spacing-2xl); }
    .btn-outline { background: transparent; border: 2px solid var(--color-primary); color: var(--color-primary); &:hover { background: var(--color-primary); color: white; } }
    .loading { text-align: center; padding: var(--spacing-4xl); font-size: var(--font-size-lg); color: var(--color-text-light); }
    .promo-banner { background: linear-gradient(135deg, var(--color-primary) 0%, #6B0000 100%); padding: var(--spacing-4xl) 0; position: relative; overflow: hidden; &::before { content: ''; position: absolute; top: -50%; right: -20%; width: 60%; height: 200%; background: radial-gradient(circle, rgba(212,165,116,0.2) 0%, transparent 70%); pointer-events: none; } }
    .promo-content { position: relative; z-index: 1; text-align: center; color: white; .promo-tag { display: inline-block; font-family: var(--font-body); font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); letter-spacing: var(--letter-spacing-widest); text-transform: uppercase; color: var(--color-secondary); margin-bottom: var(--spacing-md); } h2 { font-family: var(--font-heading); font-size: var(--font-size-5xl); color: white; margin-bottom: var(--spacing-md); } p { font-size: var(--font-size-lg); color: rgba(255, 255, 255, 0.9); margin-bottom: var(--spacing-xl); } }
    .features { background: var(--color-bg); }
    .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-xl); }
    .feature { text-align: center; padding: var(--spacing-xl); background: var(--color-bg-light); border-radius: var(--radius-xl); border: 1px solid var(--color-border-light); transition: all var(--transition-smooth); &:hover { transform: translateY(-8px); box-shadow: var(--shadow-xl); border-color: var(--color-secondary); } .feature-icon { width: 72px; height: 72px; margin: 0 auto var(--spacing-lg); background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; i { font-size: 1.5rem; color: white; } } h3 { font-family: var(--font-heading); font-size: var(--font-size-lg); color: var(--color-text); margin-bottom: var(--spacing-sm); } p { font-size: var(--font-size-sm); color: var(--color-text-light); margin: 0; } }

    /* Responsive */
    @media (max-width: 992px) {
      .badges-grid, .category-grid, .features-grid { grid-template-columns: repeat(2, 1fr); }
      .category-card.category-card-lg { grid-row: span 1; .category-image img { min-height: 280px; } }
    }
    @media (max-width: 576px) {
      .hero { min-height: 100svh; }
      .hero-content { padding: var(--spacing-md); }
      .hero-content h1 { font-size: clamp(1.6rem, 7vw, 2.2rem); }
      .hero-content p { font-size: var(--font-size-sm); margin-bottom: var(--spacing-xl); }
      .hero-actions { flex-direction: column; align-items: stretch; gap: var(--spacing-md); }
      .hero-actions .btn { width: 100%; justify-content: center; }
      .hero-scroll { display: none; }
      .badges-grid { grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md); }
      .badge { flex-direction: column; text-align: center; gap: var(--spacing-sm); }
      .features-grid { grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md); }
      .feature { padding: var(--spacing-md); }
      .section-title { font-size: var(--font-size-2xl); }
      .promo-content h2 { font-size: var(--font-size-3xl); }
      .promo-content p { font-size: var(--font-size-sm); }
    }
    @media (max-width: 380px) {
      .features-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit {
  public productService = inject(ProductService);
  public wishlistService = inject(WishlistService);
  public cartService = inject(CartService);
  public router = inject(Router);

  featuredProducts: Product[] = [];
  newArrivals: Product[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadNewArrivals();
  }

  loadNewArrivals(): void {
    this.productService.getNewArrivals().subscribe({
      next: (res) => { this.newArrivals = res.data; },
      error: () => { }
    });
  }

  loadFeaturedProducts(): void {
    this.productService.getFeaturedProducts().subscribe({
      next: (response) => {
        this.featuredProducts = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleWishlist(event: Event, productId: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlistService.toggleWishlist(productId).subscribe();
  }

  quickAddToCart(event: Event, product: Product): void {
    event.preventDefault();
    event.stopPropagation();
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size';
    this.cartService.addToCart(product, 1, size);
  }

  isNew(product: Product): boolean {
    // Check if product is new (created within last 7 days)
    if (!product.createdAt) return false;
    const createdDate = new Date(product.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }

  // Convert Product to PremiumProduct for the card component
  convertToPremiumProduct(product: Product): PremiumProduct {
    return {
      _id: product._id,
      name: product.name,
      images: product.images,
      originalPrice: product.price,
      discountedPrice: product.price, // Add discount logic if needed
      isPremium: product.isFeatured,
      stock: product.stock,
      category: product.category,
      description: product.description,
      sizes: product.sizes
    };
  }

  // Get color theme based on category
  getColorTheme(product: Product): 'gold' | 'royal-blue' | 'emerald' {
    const category = product.category?.toLowerCase() || '';
    if (category.includes('leahenga') || category.includes('saree')) {
      return 'gold';
    } else if (category.includes('gown')) {
      return 'royal-blue';
    } else if (category.includes('kurti') || category.includes('saree')) {
      return 'emerald';
    }
    return 'gold';
  }

  // Handle quick view event - navigate to product detail page
  onQuickView(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  // Handle add to cart event
  onAddToCart(event: { productId: string; quantity: number; size: string }): void {
    console.log('Added to cart:', event);
    // Cart service already handles this, add toast notification if needed
  }
}
