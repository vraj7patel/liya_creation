import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-page">
      <div class="cart-header">
        <div class="container">
          <h1>Shopping Cart</h1>
          <p>{{ cartService.cartCount() }} items in your cart</p>
        </div>
      </div>

      <div class="container">
        @if (!authService.isLoggedIn()) {
          <div class="login-prompt">
            <div class="prompt-card">
              <i class="fas fa-shopping-bag"></i>
              <h2>Sign in to view your cart</h2>
              <p>Your cart items will be saved to your account</p>
              <a routerLink="/auth/login" class="btn btn-primary btn-lg">Sign In</a>
            </div>
          </div>
        } @else if (cartService.cartCount() === 0) {
          <div class="empty-cart">
            <div class="empty-cart-icon">
              <i class="fas fa-shopping-bag"></i>
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <a routerLink="/products" class="btn btn-primary btn-lg">
              <i class="fas fa-store"></i> Start Shopping
            </a>
          </div>
        } @else {
          <div class="cart-layout">
            <div class="cart-items">
              <div class="cart-table-header hide-mobile">
                <span class="col-product">Product</span>
                <span class="col-price">Price</span>
                <span class="col-quantity">Quantity</span>
                <span class="col-total">Total</span>
                <span class="col-action"></span>
              </div>
              
              @for (item of cartService.cartItems(); track item.product._id + item.size) {
                <div class="cart-item">
                  <div class="item-product">
                    <div class="product-image">
                      @if (item.product.images && item.product.images.length > 0) {
                        <img [src]="getImageUrl(item.product.images[0])" [alt]="item.product.name">
                      } @else {
                        <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=120&fit=crop" [alt]="item.product.name">
                      }
                    </div>
                    <div class="product-details">
                      <h3>{{ item.product.name }}</h3>
                      <p class="product-category">{{ item.product.category }}</p>
                      <p class="product-size">Size: {{ item.size }}</p>
                    </div>
                  </div>
                  
                  <div class="item-price">
                    <span class="hide-desktop hide-tablet">Price:</span>
                    <span class="price">₹{{ item.product.price | number }}</span>
                  </div>
                  
                  <div class="item-quantity">
                    <span class="hide-desktop hide-tablet">Quantity:</span>
                    <div class="quantity-controls">
                      <button (click)="updateQuantity(item, item.quantity - 1)" [disabled]="item.quantity <= 1">
                        <i class="fas fa-minus"></i>
                      </button>
                      <span>{{ item.quantity }}</span>
                      <button (click)="updateQuantity(item, item.quantity + 1)">
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div class="item-total">
                    <span class="hide-desktop hide-tablet">Total:</span>
                    <span class="total-price">₹{{ item.product.price * item.quantity | number }}</span>
                  </div>
                  
                  <div class="item-action">
                    <button class="remove-btn" (click)="removeItem(item)" title="Remove item">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              }

              <div class="cart-actions">
                <a routerLink="/products" class="btn btn-ghost">
                  <i class="fas fa-arrow-left"></i> Continue Shopping
                </a>
                <button class="btn btn-ghost" (click)="clearCart()">
                  <i class="fas fa-trash"></i> Clear Cart
                </button>
              </div>
            </div>

            <div class="cart-summary">
              <div class="summary-card">
                <h2>Order Summary</h2>
                
                <div class="summary-details">
                  <div class="summary-row">
                    <span>Subtotal</span>
                    <span>₹{{ cartService.cartTotal() | number }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Shipping</span>
                    <span class="free">Free</span>
                  </div>
                  <div class="summary-row">
                    <span>Estimated Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                
                <div class="summary-total">
                  <span>Total</span>
                  <span class="total-amount">₹{{ cartService.cartTotal() | number }}</span>
                </div>

                <a routerLink="/checkout" class="btn btn-primary btn-block btn-lg">
                  <i class="fas fa-lock"></i> Proceed to Checkout
                </a>

                <div class="secure-checkout">
                  <i class="fas fa-shield-alt"></i>
                  <span>Secure checkout powered by Stripe</span>
                </div>

                <div class="summary-benefits">
                  <div class="benefit">
                    <i class="fas fa-shipping-fast"></i>
                    <span>Free shipping above ₹1,999</span>
                  </div>
                  <div class="benefit">
                    <i class="fas fa-undo"></i>
                    <span>Easy 30-day returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      min-height: 100vh;
      background: var(--color-bg);
    }

    .cart-header {
      background: linear-gradient(135deg, var(--color-forest) 0%, #0f2922 100%);
      padding: var(--spacing-2xl) 0;
      margin-bottom: var(--spacing-2xl);
    }

    .cart-header h1 {
      font-family: var(--font-heading);
      font-size: var(--font-size-4xl);
      color: white;
      margin-bottom: var(--spacing-sm);
    }

    .cart-header p {
      font-size: var(--font-size-base);
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }

    .login-prompt, .empty-cart {
      text-align: center;
      padding: var(--spacing-4xl);
      background: var(--color-bg-light);
      border-radius: var(--radius-xl);
    }

    .login-prompt .prompt-card {
      background: var(--color-bg);
      padding: var(--spacing-2xl);
      border-radius: var(--radius-xl);
      max-width: 400px;
      margin: 0 auto;
    }

    .login-prompt i, .empty-cart-icon i {
      font-size: 3rem;
      color: var(--color-primary);
      margin-bottom: var(--spacing-lg);
    }

    .empty-cart-icon {
      width: 120px;
      height: 120px;
      margin: 0 auto var(--spacing-xl);
      background: var(--color-bg);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-cart-icon i {
      font-size: 3rem;
      color: var(--color-text-muted);
    }

    .login-prompt h2, .empty-cart h2 {
      font-family: var(--font-heading);
      font-size: var(--font-size-3xl);
      color: var(--color-text);
      margin-bottom: var(--spacing-md);
    }

    .login-prompt p, .empty-cart p {
      color: var(--color-text-light);
      margin-bottom: var(--spacing-xl);
    }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: var(--spacing-2xl);
      padding-bottom: var(--spacing-4xl);
    }

    .cart-table-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 50px;
      gap: var(--spacing-lg);
      padding: var(--spacing-md) var(--spacing-lg);
      background: var(--color-bg-light);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-light);
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-wide);
    }

    .cart-item {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 50px;
      gap: var(--spacing-lg);
      padding: var(--spacing-lg);
      background: var(--color-bg-light);
      border-radius: var(--radius-xl);
      margin-bottom: var(--spacing-md);
      align-items: center;
      transition: all var(--transition-smooth);
    }

    .cart-item:hover {
      box-shadow: var(--shadow-lg);
    }

    .item-product {
      display: flex;
      gap: var(--spacing-lg);
    }

    .product-image {
      width: 100px;
      height: 120px;
      border-radius: var(--radius-md);
      overflow: hidden;
      flex-shrink: 0;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-details h3 {
      font-family: var(--font-heading);
      font-size: var(--font-size-base);
      color: var(--color-text);
      margin-bottom: var(--spacing-xs);
    }

    .product-category {
      font-size: var(--font-size-xs);
      color: var(--color-secondary);
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-wide);
      margin-bottom: var(--spacing-xs);
    }

    .product-size {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin: 0;
    }

    .item-price .price,
    .item-total .total-price {
      font-family: var(--font-heading);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      padding: var(--spacing-xs);
    }

    .quantity-controls button {
      width: 32px;
      height: 32px;
      border: none;
      background: white;
      border-radius: var(--radius-sm);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      color: var(--color-text);
    }

    .quantity-controls button:hover:not(:disabled) {
      background: var(--color-secondary);
      color: white;
    }

    .quantity-controls button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity-controls span {
      min-width: 32px;
      text-align: center;
      font-weight: var(--font-weight-medium);
    }

    .remove-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-btn:hover {
      background: rgba(220, 53, 69, 0.1);
      color: var(--color-error);
    }

    .cart-actions {
      display: flex;
      justify-content: space-between;
      margin-top: var(--spacing-lg);
    }

    .cart-summary {
      position: -webkit-sticky;
      position: sticky;
      top: 100px;
    }

    .summary-card {
      background: var(--color-bg-light);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      border: 1px solid var(--color-border-light);
    }

    .summary-card h2 {
      font-family: var(--font-heading);
      font-size: var(--font-size-xl);
      color: var(--color-text);
      margin-bottom: var(--spacing-xl);
      padding-bottom: var(--spacing-md);
      border-bottom: 1px solid var(--color-border-light);
    }

    .summary-details {
      margin-bottom: var(--spacing-lg);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: var(--spacing-md) 0;
      font-size: var(--font-size-sm);
      color: var(--color-text-light);
      border-bottom: 1px solid var(--color-border-light);
    }

    .summary-row .free {
      color: var(--color-success);
      font-weight: var(--font-weight-medium);
    }

    .summary-total {
      display: flex;
      justify-content: space-between;
      padding: var(--spacing-lg) 0;
      font-family: var(--font-heading);
      font-size: var(--font-size-xl);
      color: var(--color-text);
      border-bottom: 2px solid var(--color-border);
      margin-bottom: var(--spacing-xl);
    }

    .total-amount {
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
    }

    .secure-checkout {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-lg);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .summary-benefits {
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--color-border-light);
    }

    .benefit {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-sm) 0;
      font-size: var(--font-size-sm);
      color: var(--color-text-light);
    }

    .benefit i {
      color: var(--color-secondary);
    }

    @media (max-width: 992px) {
      .cart-layout { grid-template-columns: 1fr; }
      .cart-summary { position: static; }
      .cart-table-header { display: none; }
      .cart-item { grid-template-columns: 1fr; gap: var(--spacing-md); }
      .item-price, .item-quantity, .item-total { display: flex; justify-content: space-between; align-items: center; }
      .hide-mobile { display: none; }
    }
    @media (max-width: 576px) {
      .cart-header { padding: var(--spacing-xl) 0; }
      .cart-header h1 { font-size: var(--font-size-2xl); }
      .cart-actions { flex-direction: column; gap: var(--spacing-md); }
      .cart-actions .btn { width: 100%; justify-content: center; }
      .product-image { width: 80px; height: 96px; }
      .item-product { gap: var(--spacing-md); }
      .product-details h3 { font-size: var(--font-size-sm); }
      .summary-card { padding: var(--spacing-lg); }
      .cart-item { padding: var(--spacing-md); }
      .item-price .price, .item-total .total-price { font-size: var(--font-size-base); }
    }
    @media (max-width: 380px) {
      .product-image { width: 64px; height: 80px; }
      .product-details h3 { font-size: var(--font-size-xs); }
    }
  `]
})
export class CartComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Load cart when component initializes (if logged in)
    if (this.authService.isLoggedIn()) {
      this.cartService.loadCart();
    }
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=120&fit=crop';
    if (imagePath.startsWith('http')) return imagePath;
    // Use relative path for proxy
    if (!imagePath.startsWith('/')) {
      return '/' + imagePath;
    }
    return imagePath;
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) return;
    
    this.cartService.updateQuantity(item.product._id, item.size, quantity).subscribe({
      next: (response) => {
        // Cart updated successfully
      },
      error: (err) => {
        console.error('Error updating quantity:', err);
      }
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.product._id, item.size).subscribe({
      next: (response) => {
        // Item removed successfully
      },
      error: (err) => {
        console.error('Error removing item:', err);
      }
    });
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart().subscribe({
        next: (response) => {
          // Cart cleared successfully
        },
        error: (err) => {
          console.error('Error clearing cart:', err);
        }
      });
    }
  }
}
