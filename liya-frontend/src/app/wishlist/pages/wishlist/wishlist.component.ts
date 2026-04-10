import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/services/product.service';
import { PremiumProductCardComponent, PremiumProduct } from '../../../shared/components/premium-product-card/premium-product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, PremiumProductCardComponent],
  template: `
    <div class="wishlist-page">
      <div class="container">
        <div class="page-header">
          <h1>My Wishlist</h1>
          @if (wishlistService.wishlistCount() > 0) {
            <p>{{ wishlistService.wishlistCount() }} items in your wishlist</p>
          } @else {
            <p>No items in your wishlist</p>
          }
        </div>

        @if (!authService.isLoggedIn()) {
          <div class="login-prompt">
            <div class="prompt-card">
              <i class="fas fa-heart"></i>
              <h2>Sign in to view your wishlist</h2>
              <p>Save your favorite items and access them from any device</p>
              <a routerLink="/auth/login" class="btn btn-primary">Sign In</a>
            </div>
          </div>
        } @else if (wishlistService.loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading your wishlist...</p>
          </div>
        } @else if (wishlistService.wishlistCount() === 0) {
          <div class="empty-wishlist">
            <div class="empty-icon">
              <i class="far fa-heart"></i>
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love by clicking the heart icon</p>
            <a routerLink="/products" class="btn btn-primary">Start Shopping</a>
          </div>
        } @else {
          <div class="products-grid">
            @for (item of wishlistService.getWishlistItems(); track item.product._id) {
              <app-premium-product-card
                [product]="convertToPremiumProduct(item.product)"
                [colorTheme]="getColorTheme(item.product)">
              </app-premium-product-card>
            }
          </div>

          <div class="wishlist-actions">
            <button class="btn btn-outline" (click)="clearWishlist()">
              <i class="fas fa-trash"></i> Clear Wishlist
            </button>
            <a routerLink="/products" class="btn btn-primary">
              Continue Shopping
            </a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .wishlist-page { padding: var(--spacing-xl) 0; min-height: 60vh; }
    .page-header { text-align: center; margin-bottom: var(--spacing-2xl); }
    .page-header h1 { font-family: var(--font-heading); font-size: var(--font-size-3xl); color: var(--color-text); margin-bottom: var(--spacing-sm); }
    .page-header p { font-size: var(--font-size-base); color: var(--color-text-light); }
    
    .empty-wishlist, .login-prompt { text-align: center; padding: var(--spacing-2xl); }
    .empty-icon { width: 120px; height: 120px; margin: 0 auto var(--spacing-xl); background: var(--color-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .empty-icon i { font-size: 48px; color: var(--color-text-muted); }
    .empty-wishlist h2, .login-prompt h2 { font-family: var(--font-heading); font-size: var(--font-size-xl); margin-bottom: var(--spacing-sm); }
    .empty-wishlist p, .login-prompt p { color: var(--color-text-light); margin-bottom: var(--spacing-xl); }
    
    .prompt-card { background: var(--color-bg-light); padding: var(--spacing-2xl); border-radius: var(--radius-xl); max-width: 400px; margin: 0 auto; }
    .prompt-card i { font-size: 48px; color: var(--color-primary); margin-bottom: var(--spacing-lg); }
    
    .loading-state { text-align: center; padding: var(--spacing-2xl); }
    .loading-state .spinner { margin: 0 auto var(--spacing-md); }
    
    .wishlist-actions { display: flex; justify-content: space-between; align-items: center; margin-top: var(--spacing-2xl); gap: var(--spacing-md); flex-wrap: wrap; }
    .wishlist-actions .btn { padding: var(--spacing-md) var(--spacing-xl); }
    
    @media (max-width: 576px) { 
      .wishlist-actions { flex-direction: column; } 
      .wishlist-actions .btn { width: 100%; justify-content: center; }
      .page-header h1 { font-size: var(--font-size-2xl); }
    }
  `]
})
export class WishlistComponent implements OnInit {
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);
  authService = inject(AuthService);
  private router = inject(Router);
  
  addingToCart = false;

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.wishlistService.loadWishlist();
    }
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return 'https://via.placeholder.com/300x400';
    if (imagePath.startsWith('http')) return imagePath;
    // Use relative path for proxy
    if (!imagePath.startsWith('/')) {
      return '/' + imagePath;
    }
    return imagePath;
  }

  removeFromWishlist(productId: string): void {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        // Removed successfully
      },
      error: (err) => {
        console.error('Error removing from wishlist:', err);
      }
    });
  }

  addToCart(product: Product): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.addingToCart = true;
    
    this.cartService.addToCart(product, 1, product.sizes?.[0] || 'Free Size').subscribe({
      next: (response) => {
        if (response.success) {
          // Remove from wishlist after adding to cart
          this.removeFromWishlist(product._id);
        }
        this.addingToCart = false;
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.addingToCart = false;
      }
    });
  }

  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      this.wishlistService.clearWishlist().subscribe({
        next: () => {
          // Cleared successfully
        },
        error: (err) => {
          console.error('Error clearing wishlist:', err);
        }
      });
    }
  }

  convertToPremiumProduct(product: Product): PremiumProduct {
    return {
      _id: product._id,
      name: product.name,
      images: product.images,
      originalPrice: product.price,
      discountedPrice: product.price, // Same discount logic
      isPremium: product.isFeatured,
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
