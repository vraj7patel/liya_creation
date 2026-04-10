import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, Review } from '../../../core/services/product.service';
import { PremiumProductCardComponent, PremiumProduct } from '../../../shared/components/premium-product-card/premium-product-card.component';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PremiumProductCardComponent],
  template: `
    <div class="product-detail-page">

      @if (loading) {
        <div class="loading">Loading product...</div>
      } @else if (product) {
        <div class="product-breadcrumb">
          <div class="container">
            <nav class="breadcrumb">
              <a routerLink="/">Home</a>
              <i class="fas fa-chevron-right"></i>
              <a routerLink="/products">Products</a>
              <i class="fas fa-chevron-right"></i>
              <a [routerLink]="['/products/category', product.category]">{{ product.category }}</a>
              <i class="fas fa-chevron-right"></i>
              <span>{{ product.name }}</span>
            </nav>
          </div>
        </div>

        <div class="container">
          <div class="product-layout">
            <!-- Images -->
            <div class="product-images">
              <div class="main-image">
                @if (product.images.length > 0) {
                  <img [src]="productService.getImageUrl(product.images[selectedImageIndex])" [alt]="product.name">
                } @else {
                  <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop" [alt]="product.name">
                }
                @if (product.stock === 0) {
                  <div class="stock-badge sold-out">Sold Out</div>
                }
                <button class="wishlist-btn" [class.filled]="isInWishlist()" (click)="toggleWishlist()" [title]="isInWishlist() ? 'Remove from wishlist' : 'Add to wishlist'">
                  <span class="wishlist-icon-wrapper">
                    @if (!isInWishlist()) {
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="heart-outline">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    }
                    @if (isInWishlist()) {
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="heart-filled">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    }
                  </span>
                </button>
                <button class="share-btn" (click)="shareProduct()" title="Share product">
                  <i class="fas fa-share-alt"></i>
                </button>
              </div>
              @if (product.images.length > 1) {
                <div class="thumbnail-list">
                  @for (image of product.images; track $index) {
                    <button class="thumbnail" [class.active]="selectedImageIndex === $index" (click)="selectedImageIndex = $index">
                      <img [src]="productService.getImageUrl(image)" [alt]="product.name">
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Info -->
            <div class="product-info">
              <div class="product-header">
                <span class="product-category">{{ product.category }}</span>
                <h1>{{ product.name }}</h1>
                <!-- Rating summary inline -->
                @if ((product.numReviews ?? 0) > 0) {
                  <div class="rating-inline">
                    <div class="stars-display">
                      @for (s of [1,2,3,4,5]; track s) {
                        <i class="fas fa-star" [class.filled]="s <= (product.averageRating ?? 0)" [class.half]="s - 0.5 <= (product.averageRating ?? 0) && s > (product.averageRating ?? 0)"></i>
                      }
                    </div>
                    <span class="rating-count">{{ product.averageRating?.toFixed(1) }} ({{ product.numReviews }} {{ product.numReviews === 1 ? 'review' : 'reviews' }})</span>
                  </div>
                }
              </div>

              <div class="price-section">
                <span class="price">₹{{ product.price | number }}</span>
              </div>

              <div class="description">
                <h3>Description</h3>
                <p>{{ product.description }}</p>
              </div>

              @if (product.sizes.length > 0) {
                <div class="size-section">
                  <h3>Select Size</h3>
                  <div class="size-options">
                    @for (size of product.sizes; track size) {
                      <button class="size-btn" [class.active]="selectedSize === size" (click)="selectedSize = size">{{ size }}</button>
                    }
                  </div>
                </div>
              }

              <div class="quantity-section" [class.disabled-section]="product.stock === 0">
                <h3>Quantity</h3>
                <div class="quantity-selector">
                  <button (click)="decreaseQuantity()" [disabled]="product.stock === 0"><i class="fas fa-minus"></i></button>
                  <input type="number" [(ngModel)]="quantity" min="1" [max]="product.stock" [disabled]="product.stock === 0">
                  <button (click)="increaseQuantity()" [disabled]="product.stock === 0"><i class="fas fa-plus"></i></button>
                </div>
                @if (product.stock > 0) {
                  <p class="stock-info"><i class="fas fa-check-circle"></i> {{ product.stock }} items in stock</p>
                } @else {
                  <p class="out-of-stock"><i class="fas fa-times-circle"></i> Out of stock</p>
                }
              </div>

              <div class="action-buttons">
                <button class="btn btn-primary btn-lg" [disabled]="product.stock === 0 || addingToCart" (click)="addToCart()">
                  <i class="fas fa-shopping-bag"></i> {{ addingToCart ? 'Adding...' : 'Add to Cart' }}
                </button>
                <button class="btn btn-secondary btn-lg" [disabled]="product.stock === 0 || processingBuyNow" (click)="buyNow()">
                  <i class="fas fa-bolt"></i> {{ processingBuyNow ? 'Processing...' : 'Buy Now' }}
                </button>
              </div>

              @if (successMessage) {
                <div class="alert alert-success"><i class="fas fa-check-circle"></i> {{ successMessage }}</div>
              }
              @if (errorMessage) {
                <div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> {{ errorMessage }}</div>
              }

              <!-- Trust badges -->
              <div class="trust-badges">
                <div class="badge-item">
                  <div class="badge-icon"><i class="fas fa-shipping-fast"></i></div>
                  <div class="badge-text">
                    <strong>Free Shipping</strong>
                    <span>On orders above ₹1,999</span>
                  </div>
                </div>
                <div class="badge-item">
                  <div class="badge-icon"><i class="fas fa-undo-alt"></i></div>
                  <div class="badge-text">
                    <strong>Easy Returns</strong>
                    <span>30-day return policy</span>
                  </div>
                </div>
                <div class="badge-item">
                  <div class="badge-icon"><i class="fas fa-shield-alt"></i></div>
                  <div class="badge-text">
                    <strong>Secure Payment</strong>
                    <span>100% protected checkout</span>
                  </div>
                </div>
                <div class="badge-item">
                  <div class="badge-icon"><i class="fas fa-gem"></i></div>
                  <div class="badge-text">
                    <strong>Authentic</strong>
                    <span>Handcrafted quality</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Decorative divider stripe -->
          <div class="section-stripe">
            <span>✦</span><span>Customer Reviews</span><span>✦</span>
          </div>

          <!-- Reviews Section -->
          <section class="reviews-section">
            <!-- Rating Overview -->
            <div class="rating-overview">
              <div class="rating-big">
                <span class="big-number">{{ (product.averageRating ?? 0).toFixed(1) }}</span>
                <div class="stars-row">
                  @for (s of [1,2,3,4,5]; track s) {
                    <i class="fas fa-star" [class.filled]="s <= (product.averageRating ?? 0)"></i>
                  }
                </div>
                <span class="review-total">{{ product.numReviews ?? 0 }} {{ (product.numReviews ?? 0) === 1 ? 'review' : 'reviews' }}</span>
              </div>
              <div class="rating-bars">
                @for (bar of ratingBars; track bar.stars) {
                  <div class="bar-row">
                    <span class="bar-label">{{ bar.stars }} <i class="fas fa-star"></i></span>
                    <div class="bar-track">
                      <div class="bar-fill" [style.width.%]="bar.percent"></div>
                    </div>
                    <span class="bar-count">{{ bar.count }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Write a Review -->
            <div class="write-review">
              <h3>Write a Review</h3>
              @if (!isLoggedIn) {
                <p class="login-prompt">
                  <a routerLink="/auth/login">Log in</a> to leave a review.
                </p>
              } @else if (hasUserReviewed) {
                <div class="already-reviewed">
                  <i class="fas fa-check-circle"></i> You've already reviewed this product.
                  <button class="btn-link" (click)="deleteReview()">Delete my review</button>
                </div>
              } @else {
                <form class="review-form" (ngSubmit)="submitReview()">
                  <div class="star-picker">
                    <span class="picker-label">Your Rating:</span>
                    @for (s of [1,2,3,4,5]; track s) {
                      <button type="button" class="star-pick" [class.active]="s <= newRating" (click)="newRating = s" (mouseenter)="hoverRating = s" (mouseleave)="hoverRating = 0">
                        <i class="fas fa-star" [class.hovered]="s <= hoverRating"></i>
                      </button>
                    }
                  </div>
                  <textarea [(ngModel)]="newComment" name="comment" placeholder="Share your experience with this product..." rows="4" maxlength="500"></textarea>
                  <div class="form-footer">
                    <span class="char-count">{{ newComment.length }}/500</span>
                    <button type="submit" class="btn btn-primary" [disabled]="submittingReview || newRating === 0 || !newComment.trim()">
                      {{ submittingReview ? 'Submitting...' : 'Submit Review' }}
                    </button>
                  </div>
                  @if (reviewError) {
                    <div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> {{ reviewError }}</div>
                  }
                </form>
              }
            </div>

            <!-- Review List -->
            <div class="review-list">
              @if ((product.reviews?.length ?? 0) === 0) {
                <div class="no-reviews">
                  <i class="fas fa-comment-slash"></i>
                  <p>No reviews yet. Be the first to share your thoughts!</p>
                </div>
              } @else {
                @for (review of product.reviews; track review._id) {
                  <div class="review-card">
                    <div class="review-header">
                      <div class="reviewer-avatar">{{ review.name.charAt(0).toUpperCase() }}</div>
                      <div class="reviewer-info">
                        <strong>{{ review.name }}</strong>
                        <span class="review-date">{{ review.createdAt | date:'mediumDate' }}</span>
                      </div>
                      <div class="review-stars">
                        @for (s of [1,2,3,4,5]; track s) {
                          <i class="fas fa-star" [class.filled]="s <= review.rating"></i>
                        }
                      </div>
                    </div>
                    <p class="review-comment">{{ review.comment }}</p>
                  </div>
                }
              }
            </div>
          </section>

          <!-- Related Products -->
          @if (relatedProducts.length > 0) {
            <div class="section-stripe">
              <span>✦</span><span>You May Also Like</span><span>✦</span>
            </div>
            <section class="related-products">
              <div class="products-grid">
                @for (related of relatedProducts; track related._id) {
                  <app-premium-product-card
                    [product]="convertToPremiumProduct(related)"
                    [colorTheme]="getColorTheme(related)">
                  </app-premium-product-card>
                }
              </div>
            </section>
          }
        </div>
      } @else {
        <div class="container">
          <div class="not-found">
            <i class="fas fa-search"></i>
            <h2>Product not found</h2>
            <p>The product you're looking for doesn't exist or has been removed.</p>
            <a routerLink="/products" class="btn btn-primary">Back to Products</a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    /* ── Stripe Banner ── */
    .stripe-banner { background: linear-gradient(135deg, var(--color-primary), #8B1A1A); overflow: hidden; padding: 10px 0; }
    .stripe-track { display: flex; gap: 2.5rem; white-space: nowrap; animation: marquee 28s linear infinite; color: #fff; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
    .stripe-track .dot { color: var(--color-secondary, #D4AF37); }
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

    /* ── Section Stripe Divider ── */
    .section-stripe { display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 2.5rem 0 1.5rem; font-family: var(--font-heading); font-size: 1.4rem; color: var(--color-text); }
    .section-stripe span:first-child, .section-stripe span:last-child { color: var(--color-secondary, #D4AF37); font-size: 1rem; }

    /* ── Page base ── */
    .product-detail-page { min-height: 100vh; background: var(--color-bg); }
    .product-breadcrumb { background: var(--color-bg-light); padding: var(--spacing-lg) 0; border-bottom: 1px solid var(--color-border-light); }
    .breadcrumb { display: flex; align-items: center; gap: var(--spacing-md); font-size: var(--font-size-sm); color: var(--color-text-muted); flex-wrap: wrap; }
    .breadcrumb a { color: var(--color-text-light); text-decoration: none; transition: color var(--transition-fast); }
    .breadcrumb a:hover { color: var(--color-primary); }
    .breadcrumb i { font-size: 0.65rem; color: var(--color-text-muted); }
    .breadcrumb span { color: var(--color-text); }

    /* ── Layout ── */
    .product-layout { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-3xl); padding: var(--spacing-2xl) 0 var(--spacing-4xl); }

    /* ── Images ── */
    .product-images .main-image { position: relative; border-radius: var(--radius-xl); overflow: hidden; background: var(--color-bg-light); margin-bottom: var(--spacing-lg); }
    .product-images .main-image img { width: 100%; height: auto; max-height: 700px; object-fit: cover; }
    .product-images .main-image .stock-badge { position: absolute; top: var(--spacing-lg); left: var(--spacing-lg); padding: var(--spacing-sm) var(--spacing-lg); border-radius: var(--radius-md); font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); }
    .product-images .main-image .stock-badge.sold-out { background: var(--color-text); color: white; }
    .product-images .main-image .wishlist-btn { position: absolute; top: var(--spacing-lg); right: var(--spacing-lg); z-index: 15; width: 44px; height: 44px; border-radius: 50%; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.95); box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
    .product-images .main-image .wishlist-btn .wishlist-icon-wrapper { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; }
    .product-images .main-image .wishlist-btn svg { width: 22px; height: 22px; transition: all 0.3s; }
    .product-images .main-image .wishlist-btn .heart-outline { color: #666; }
    .product-images .main-image .wishlist-btn .heart-filled { color: white; }
    .product-images .main-image .wishlist-btn:hover { transform: scale(1.15); }
    .product-images .main-image .wishlist-btn:hover .heart-outline { color: #D4AF37; }
    .product-images .main-image .wishlist-btn.filled { background: linear-gradient(135deg, #D4AF37, #b8960f); }
    .product-images .main-image .share-btn { position: absolute; top: var(--spacing-lg); right: calc(var(--spacing-lg) + 56px); z-index: 15; width: 44px; height: 44px; border-radius: 50%; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.95); box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.3s; }
    .product-images .main-image .share-btn i { font-size: 1rem; color: #666; transition: all 0.3s; }
    .product-images .main-image .share-btn:hover { transform: scale(1.15); }
    .product-images .main-image .share-btn:hover i { color: var(--color-primary); }
    .product-images .thumbnail-list { display: flex; gap: var(--spacing-md); flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory; padding-bottom: 8px; scrollbar-width: none; }
    .product-images .thumbnail-list::-webkit-scrollbar { display: none; }
    .product-images .thumbnail-list .thumbnail { scroll-snap-align: start; flex-shrink: 0; width: 80px; height: 100px; border: 2px solid transparent; border-radius: var(--radius-md); overflow: hidden; cursor: pointer; padding: 0; background: none; transition: all var(--transition-smooth); }
    .product-images .thumbnail-list .thumbnail.active { border-color: var(--color-secondary); box-shadow: var(--shadow-glow); }
    .product-images .thumbnail-list .thumbnail img { width: 100%; height: 100%; object-fit: cover; }

    /* ── Product Info ── */
    .product-info .product-header { margin-bottom: var(--spacing-xl); }
    .product-info .product-header .product-category { display: inline-block; font-size: var(--font-size-xs); color: var(--color-secondary); text-transform: uppercase; letter-spacing: var(--letter-spacing-widest); margin-bottom: var(--spacing-sm); }
    .product-info .product-header h1 { font-family: var(--font-heading); font-size: var(--font-size-4xl); color: var(--color-text); line-height: 1.2; }
    .rating-inline { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
    .rating-inline .stars-display i { color: #ddd; font-size: 0.9rem; }
    .rating-inline .stars-display i.filled { color: #D4AF37; }
    .rating-inline .rating-count { font-size: 0.85rem; color: var(--color-text-light); }
    .product-info .price-section { margin-bottom: var(--spacing-xl); padding-bottom: var(--spacing-xl); border-bottom: 1px solid var(--color-border-light); }
    .product-info .price-section .price { font-family: var(--font-heading); font-size: var(--font-size-4xl); font-weight: var(--font-weight-bold); color: var(--color-primary); }
    .product-info .description { margin-bottom: var(--spacing-xl); }
    .product-info .description h3 { font-family: var(--font-heading); font-size: var(--font-size-lg); color: var(--color-text); margin-bottom: var(--spacing-md); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); }
    .product-info .description p { color: var(--color-text-light); line-height: 1.8; margin: 0; }
    .product-info .size-section, .product-info .quantity-section { margin-bottom: var(--spacing-xl); }
    .product-info .size-section h3, .product-info .quantity-section h3 { font-family: var(--font-heading); font-size: var(--font-size-base); color: var(--color-text); margin-bottom: var(--spacing-md); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); }
    .product-info .size-options {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      -ms-overflow-style: none;
      gap: var(--spacing-md);
      padding-bottom: 4px;
    }
    .product-info .size-options::-webkit-scrollbar { display: none; }
    .product-info .size-options .size-btn { flex-shrink: 0; min-width: 60px; padding: var(--spacing-md) var(--spacing-lg); border: 2px solid var(--color-border); background: white; border-radius: var(--radius-md); font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); cursor: pointer; transition: all var(--transition-smooth); white-space: nowrap; }
    .product-info .size-options .size-btn:hover { border-color: var(--color-secondary); color: var(--color-secondary); }
    .product-info .size-options .size-btn.active { border-color: var(--color-secondary); background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark)); color: white; box-shadow: var(--shadow-glow); }
    .product-info .quantity-selector { display: flex; align-items: center; gap: var(--spacing-md); }
    .product-info .quantity-selector button { width: 44px; height: 44px; border: 2px solid var(--color-border); background: white; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); color: var(--color-text); transition: all var(--transition-smooth); }
    .product-info .quantity-selector button:hover:not(:disabled) { border-color: var(--color-secondary); color: var(--color-secondary); }
    .product-info .quantity-selector button:disabled { opacity: 0.4; cursor: not-allowed; }
    .product-info .quantity-selector input { width: 70px; height: 44px; text-align: center; border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-base); font-weight: var(--font-weight-medium); }
    .product-info .quantity-selector input:focus { outline: none; border-color: var(--color-secondary); }
    .product-info .quantity-selector input:disabled { background: #f5f5f5; color: #aaa; cursor: not-allowed; }
    .product-info .disabled-section { opacity: 0.5; pointer-events: none; }
    .product-info .stock-info { margin-top: var(--spacing-md); font-size: var(--font-size-sm); color: var(--color-success); }
    .product-info .stock-info i { margin-right: var(--spacing-sm); }
    .product-info .out-of-stock { margin-top: var(--spacing-md); font-size: var(--font-size-sm); color: var(--color-error); }
    .product-info .out-of-stock i { margin-right: var(--spacing-sm); }
    .product-info .action-buttons { display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-xl); }
    .product-info .action-buttons .btn { flex: 1; height: 52px; padding: 0 10px; font-size: 0.75rem; font-weight: var(--font-weight-semibold); display: flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap; letter-spacing: 0.02em; border-radius: 50px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.3s cubic-bezier(0.4,0,0.2,1); overflow: hidden; }
    .product-info .alert { display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-lg); }
    .product-info .alert-success { background: #d4edda; color: #155724; padding: var(--spacing-md); border-radius: var(--radius-md); }
    .product-info .alert-error { background: #f8d7da; color: #721c24; padding: var(--spacing-md); border-radius: var(--radius-md); }

    /* ── Trust Badges ── */
    .trust-badges { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border-light); }
    .badge-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem; background: var(--color-bg-light); border-radius: var(--radius-md); border: 1px solid var(--color-border-light); }
    .badge-icon { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), #8B1A1A); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .badge-icon i { color: white; font-size: 0.85rem; }
    .badge-text { display: flex; flex-direction: column; }
    .badge-text strong { font-size: 0.8rem; color: var(--color-text); font-weight: 600; }
    .badge-text span { font-size: 0.72rem; color: var(--color-text-light); margin-top: 2px; }

    /* ── Reviews Section ── */
    .reviews-section { padding-bottom: var(--spacing-4xl); }
    .rating-overview { display: flex; gap: 3rem; align-items: flex-start; background: var(--color-bg-light); border-radius: var(--radius-xl); padding: 2rem; margin-bottom: 2rem; border: 1px solid var(--color-border-light); }
    .rating-big { display: flex; flex-direction: column; align-items: center; min-width: 120px; }
    .big-number { font-family: var(--font-heading); font-size: 3.5rem; font-weight: 700; color: var(--color-text); line-height: 1; }
    .stars-row { display: flex; gap: 3px; margin: 0.4rem 0; }
    .stars-row i { color: #ddd; font-size: 1rem; }
    .stars-row i.filled { color: #D4AF37; }
    .review-total { font-size: 0.8rem; color: var(--color-text-light); }
    .rating-bars { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
    .bar-row { display: flex; align-items: center; gap: 0.75rem; }
    .bar-label { font-size: 0.8rem; color: var(--color-text-light); width: 40px; display: flex; align-items: center; gap: 3px; }
    .bar-label i { color: #D4AF37; font-size: 0.7rem; }
    .bar-track { flex: 1; height: 8px; background: #e9e9e9; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; background: linear-gradient(90deg, #D4AF37, #b8960f); border-radius: 4px; transition: width 0.6s ease; }
    .bar-count { font-size: 0.78rem; color: var(--color-text-light); width: 20px; text-align: right; }

    /* Write Review */
    .write-review { background: white; border: 1px solid var(--color-border-light); border-radius: var(--radius-xl); padding: 2rem; margin-bottom: 2rem; }
    .write-review h3 { font-family: var(--font-heading); font-size: 1.2rem; margin-bottom: 1.25rem; color: var(--color-text); }
    .login-prompt { color: var(--color-text-light); font-size: 0.9rem; }
    .login-prompt a { color: var(--color-primary); text-decoration: none; font-weight: 600; }
    .already-reviewed { display: flex; align-items: center; gap: 0.75rem; color: var(--color-success); font-size: 0.9rem; }
    .already-reviewed i { font-size: 1.1rem; }
    .btn-link { background: none; border: none; color: var(--color-error); cursor: pointer; font-size: 0.85rem; text-decoration: underline; padding: 0; margin-left: 0.5rem; }
    .review-form { display: flex; flex-direction: column; gap: 1rem; }
    .star-picker { display: flex; align-items: center; gap: 0.5rem; }
    .picker-label { font-size: 0.85rem; color: var(--color-text-light); margin-right: 0.25rem; }
    .star-pick { background: none; border: none; cursor: pointer; padding: 2px; font-size: 1.5rem; color: #ddd; transition: color 0.15s, transform 0.15s; }
    .star-pick.active i, .star-pick i.hovered { color: #D4AF37; }
    .star-pick:hover { transform: scale(1.2); }
    .review-form textarea { width: 100%; padding: 0.85rem 1rem; border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.9rem; font-family: inherit; resize: vertical; transition: border-color 0.2s; box-sizing: border-box; }
    .review-form textarea:focus { outline: none; border-color: var(--color-secondary); }
    .form-footer { display: flex; align-items: center; justify-content: space-between; }
    .char-count { font-size: 0.78rem; color: var(--color-text-muted); }
    .review-form .alert { margin-top: 0.5rem; padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.85rem; }
    .review-form .alert-error { background: #f8d7da; color: #721c24; }

    /* Review List */
    .review-list { display: flex; flex-direction: column; gap: 1.25rem; }
    .no-reviews { text-align: center; padding: 3rem; color: var(--color-text-muted); }
    .no-reviews i { font-size: 2.5rem; margin-bottom: 1rem; display: block; }
    .no-reviews p { font-size: 0.95rem; }
    .review-card { background: white; border: 1px solid var(--color-border-light); border-radius: var(--radius-xl); padding: 1.5rem; transition: box-shadow 0.2s; }
    .review-card:hover { box-shadow: var(--shadow-md); }
    .review-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }
    .reviewer-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), #8B1A1A); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; flex-shrink: 0; }
    .reviewer-info { flex: 1; }
    .reviewer-info strong { display: block; font-size: 0.9rem; color: var(--color-text); }
    .review-date { font-size: 0.75rem; color: var(--color-text-muted); }
    .review-stars { display: flex; gap: 2px; }
    .review-stars i { color: #ddd; font-size: 0.85rem; }
    .review-stars i.filled { color: #D4AF37; }
    .review-comment { font-size: 0.9rem; color: var(--color-text-light); line-height: 1.7; margin: 0; }

    /* ── Related Products ── */
    .related-products { padding-bottom: var(--spacing-4xl); }
    .section-stripe { display: flex; align-items: center; justify-content: center; gap: var(--spacing-md); padding: var(--spacing-lg) 0; font-family: var(--font-accent); color: var(--color-primary); font-size: var(--font-size-2xl); font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
    .section-stripe span:not(:nth-child(2)) { font-size: var(--font-size-xl); opacity: 0.5; }
    .not-found { text-align: center; padding: var(--spacing-4xl); }
    .not-found i { font-size: 4rem; color: var(--color-text-muted); margin-bottom: var(--spacing-xl); }
    .not-found h2 { font-family: var(--font-heading); font-size: var(--font-size-3xl); margin-bottom: var(--spacing-md); }
    .not-found p { color: var(--color-text-light); margin-bottom: var(--spacing-xl); }

    @media (max-width: 992px) {
      .product-layout { grid-template-columns: 1fr; gap: var(--spacing-xl); }
      .product-info .product-header h1 { font-size: var(--font-size-3xl); }
      .rating-overview { flex-direction: column; gap: 1.5rem; }
    }
    @media (max-width: 768px) {
      .product-layout { grid-template-columns: 1fr; gap: var(--spacing-xl); padding: var(--spacing-xl) 0 var(--spacing-2xl); }
    }
    @media (max-width: 576px) {
      .product-layout { padding: var(--spacing-lg) 0 var(--spacing-xl); }
      .product-info .product-header h1 { font-size: var(--font-size-2xl); }
      .product-info .price-section .price { font-size: var(--font-size-3xl); }
      .product-info .action-buttons { flex-direction: column; gap: var(--spacing-md); }
      .product-info .action-buttons .btn { width: 100%; justify-content: center; }
      .trust-badges { grid-template-columns: 1fr; }
      .product-images .main-image .share-btn { right: var(--spacing-lg); top: calc(var(--spacing-lg) + 56px); }
      .product-images .thumbnail-list { padding-bottom: 4px; }
      .product-images .thumbnail-list .thumbnail { width: 72px; height: 90px; }
      .write-review { padding: 1.25rem; }
      .rating-overview { padding: 1.25rem; }
      .review-card { padding: 1rem; }
      .section-stripe { font-size: var(--font-size-lg); gap: var(--spacing-md); }
    }
    @media (max-width: 380px) {
      .product-info .size-options .size-btn { min-width: 48px; padding: var(--spacing-sm) var(--spacing-md); }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  public productService = inject(ProductService);
  public wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  product?: Product;
  relatedProducts: Product[] = [];
  loading = true;
  selectedImageIndex = 0;
  selectedSize = '';
  quantity = 1;
  successMessage = '';
  errorMessage = '';
  addingToCart = false;
  processingBuyNow = false;

  // Reviews
  newRating = 0;
  hoverRating = 0;
  newComment = '';
  submittingReview = false;
  reviewError = '';

  get isLoggedIn(): boolean { return this.authService.isLoggedIn(); }

  get hasUserReviewed(): boolean {
    const user = (this.authService as any).currentUser?.();
    if (!user || !this.product?.reviews) return false;
    return this.product.reviews.some(r => r.user === user._id);
  }

  get ratingBars(): { stars: number; count: number; percent: number }[] {
    const reviews = this.product?.reviews ?? [];
    return [5, 4, 3, 2, 1].map(s => {
      const count = reviews.filter(r => r.rating === s).length;
      return { stars: s, count, percent: reviews.length ? (count / reviews.length) * 100 : 0 };
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) this.loadProduct(params['id']);
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (response) => {
        this.product = response.data;
        if (this.product) {
          this.product.images = this.product.images || [];
          this.product.sizes = this.product.sizes || [];
        }
        if (this.product?.sizes?.length) this.selectedSize = this.product.sizes[0];
        this.loading = false;
        this.loadRelatedProducts();
      },
      error: () => { this.loading = false; }
    });
  }

  loadRelatedProducts(): void {
    if (!this.product) return;
    this.productService.getProducts({ category: this.product.category, limit: 4 }).subscribe({
      next: (response: any) => {
        this.relatedProducts = (response.data || []).filter((p: Product) => p._id !== this.product?._id);
      },
      error: () => {}
    });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) this.quantity--;
  }

  isInWishlist(): boolean {
    if (!this.product) return false;
    return this.wishlistService.isInWishlist(this.product._id);
  }

  addToCart(): void {
    if (!this.product) return;
    if (!this.authService.isLoggedIn()) { this.router.navigate(['/auth/login']); return; }
    if (!this.selectedSize && this.product.sizes.length > 0) {
      this.errorMessage = 'Please select a size';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    this.addingToCart = true;
    this.errorMessage = '';
    this.cartService.addToCart(this.product, this.quantity, this.selectedSize || 'Free Size').subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Product added to cart successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message || 'Failed to add to cart';
          setTimeout(() => this.errorMessage = '', 3000);
        }
        this.addingToCart = false;
      },
      error: () => {
        this.errorMessage = 'Failed to add to cart. Please try again.';
        setTimeout(() => this.errorMessage = '', 3000);
        this.addingToCart = false;
      }
    });
  }

  buyNow(): void {
    if (!this.product) return;
    if (!this.authService.isLoggedIn()) { this.router.navigate(['/auth/login']); return; }
    if (!this.selectedSize && this.product.sizes.length > 0) {
      this.errorMessage = 'Please select a size';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    this.processingBuyNow = true;
    this.errorMessage = '';
    this.orderService.buyNow({ productId: this.product._id, quantity: this.quantity, size: this.selectedSize || 'Free Size' }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.router.navigate(['/checkout'], { queryParams: { orderId: response.data.orderId } });
        } else {
          this.errorMessage = response.message || 'Failed to process order';
          setTimeout(() => this.errorMessage = '', 3000);
        }
        this.processingBuyNow = false;
      },
      error: () => {
        this.errorMessage = 'Failed to process order. Please try again.';
        setTimeout(() => this.errorMessage = '', 3000);
        this.processingBuyNow = false;
      }
    });
  }

  toggleWishlist(): void {
    if (!this.product) return;
    if (!this.authService.isLoggedIn()) { this.router.navigate(['/auth/login']); return; }
    this.wishlistService.toggleWishlist(this.product._id).subscribe({ error: () => {} });
  }

  shareProduct(): void {
    if (navigator.share && this.product) {
      navigator.share({ title: this.product.name, text: `Check out ${this.product.name} at Liya Creation`, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied to clipboard!')).catch(() => {});
    }
  }

  submitReview(): void {
    if (!this.product || this.newRating === 0 || !this.newComment.trim()) return;
    this.submittingReview = true;
    this.reviewError = '';
    this.productService.addReview(this.product._id, this.newRating, this.newComment.trim()).subscribe({
      next: (res) => {
        if (res.success && this.product) {
          this.product.reviews = res.data.reviews;
          this.product.averageRating = res.data.averageRating;
          this.product.numReviews = res.data.numReviews;
          this.newRating = 0;
          this.newComment = '';
        }
        this.submittingReview = false;
      },
      error: (err) => {
        this.reviewError = err?.error?.message || 'Failed to submit review.';
        this.submittingReview = false;
      }
    });
  }

  deleteReview(): void {
    if (!this.product) return;
    this.productService.deleteReview(this.product._id).subscribe({
      next: (res) => {
        if (res.success && this.product) {
          this.product.reviews = res.data.reviews;
          this.product.averageRating = res.data.averageRating;
          this.product.numReviews = res.data.numReviews;
        }
      },
      error: () => {}
    });
  }
  convertToPremiumProduct(product: Product): PremiumProduct {
    return {
      _id: product._id,
      name: product.name,
      images: product.images,
      originalPrice: product.price,
      discountedPrice: product.price, // Same discount logic
      isPremium: product.isFeatured || false,
      stock: product.stock,
      category: product.category,
      description: product.description,
      sizes: product.sizes
    };
  }

  getColorTheme(product: Product): 'gold' | 'royal-blue' | 'emerald' {
    const category = product.category?.toLowerCase() || '';
    if (category.includes('lehenga') || category.includes('bridal')) return 'gold';
    if (category.includes('saree') || category.includes('silk')) return 'royal-blue';
    return 'emerald';
  }
}
