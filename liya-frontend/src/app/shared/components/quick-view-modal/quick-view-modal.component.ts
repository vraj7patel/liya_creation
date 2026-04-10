import {
  Component,
  input,
  Output,
  EventEmitter,
  signal,
  inject,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/services/product.service';

@Component({
  selector: 'app-quick-view-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="modal-overlay" *ngIf="isOpen()" (click)="onClose()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button class="close-btn" (click)="onClose()" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>

        <div class="modal-content" *ngIf="product()">
          <!-- Image Section -->
          <div class="modal-image">
            <img 
              [src]="primaryImage()" 
              [alt]="product()?.name"
              loading="lazy"
            />
            <!-- Badges -->
            <div class="modal-badges">
              <span class="badge-limited" *ngIf="product()?.isPremium">LIMITED</span>
              <span class="badge-discount" *ngIf="hasDiscount()">-{{ discountPercent() }}% OFF</span>
            </div>
          </div>

          <!-- Details Section -->
          <div class="modal-details">
            <!-- Category -->
            <span class="modal-category">{{ product()?.category }}</span>
            
            <!-- Name -->
            <h2 class="modal-title">{{ product()?.name }}</h2>

            <!-- Rating -->
            <div class="modal-rating" *ngIf="product()?.rating">
              <div class="stars">
                <i class="fas fa-star" *ngFor="let star of getStars()"></i>
              </div>
              <span class="rating-text">{{ product()?.rating }} ({{ product()?.reviewsCount || 0 }} reviews)</span>
            </div>

            <!-- Price -->
            <div class="modal-price">
              <span class="current-price">₹{{ displayPrice() | number:'1.0-0' }}</span>
            </div>

            <!-- Description -->
            <p class="modal-description">{{ product()?.description || 'No description available.' }}</p>

            <!-- Sizes -->
            <div class="modal-sizes" *ngIf="availableSizes().length > 1">
              <span class="size-label">Select Size:</span>
              <div class="sizes">
                <button 
                  *ngFor="let size of availableSizes()"
                  class="size-btn"
                  [class.selected]="selectedSize() === size"
                  (click)="selectSize(size)"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Quantity -->
            <div class="modal-quantity">
              <span class="qty-label">Quantity:</span>
              <div class="qty-selector">
                <button (click)="decrementQuantity()" [disabled]="quantity() <= 1">
                  <i class="fas fa-minus"></i>
                </button>
                <span>{{ quantity() }}</span>
                <button (click)="incrementQuantity()" [disabled]="quantity() >= product()?.stock">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <button 
                class="btn-add-cart"
                [disabled]="isAddingToCart()"
                (click)="onAddToCart()"
              >
                <i class="fas fa-shopping-bag"></i>
                <span>{{ isAddingToCart() ? 'Adding...' : 'Add to Cart' }}</span>
              </button>
              <button 
                class="btn-wishlist"
                [class.active]="isInWishlist()"
                (click)="onToggleWishlist()"
              >
                <i class="fa-heart" [class.fas]="isInWishlist()" [class.far]="!isInWishlist()"></i>
              </button>
            </div>

            <!-- View Full Details Link -->
            <a [routerLink]="['/products', product()?._id]" class="view-full-details" (click)="onClose()">
              View Full Details <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 20px;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-container {
      background: white;
      border-radius: 16px;
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: #f5f5f5;
      transform: rotate(90deg);
    }

    .modal-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
    }

    @media (max-width: 768px) {
      .modal-content {
        grid-template-columns: 1fr;
      }
    }

    .modal-image {
      position: relative;
      background: #f8f8f8;
    }

    .modal-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      aspect-ratio: 4/5;
    }

    .modal-badges {
      position: absolute;
      top: 16px;
      left: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .badge-limited {
      background: linear-gradient(135deg, #D4A574, #8B6914);
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.1em;
    }

    .badge-discount {
      background: #dc2626;
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .modal-details {
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .modal-category {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #6b6b6b;
    }

    .modal-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c2c2c;
      margin: 0;
    }

    .modal-rating {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stars {
      display: flex;
      gap: 2px;
    }

    .stars i {
      color: #f59e0b;
      font-size: 0.9rem;
    }

    .rating-text {
      font-size: 0.85rem;
      color: #6b6b6b;
    }

    .modal-price {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .current-price {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: #2c2c2c;
    }

    .original-price {
      font-size: 1.1rem;
      color: #9b9b9b;
      text-decoration: line-through;
    }

    .modal-description {
      font-size: 0.95rem;
      color: #6b6b6b;
      line-height: 1.6;
      margin: 0;
    }

    .modal-sizes {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .size-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #2c2c2c;
    }

    .sizes {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .size-btn {
      min-width: 44px;
      height: 40px;
      padding: 0 16px;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      background: white;
      font-size: 0.85rem;
      font-weight: 500;
      color: #2c2c2c;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .size-btn:hover {
      border-color: var(--color-primary);
    }

    .size-btn.selected {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: white;
    }

    .modal-quantity {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .qty-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #2c2c2c;
    }

    .qty-selector {
      display: flex;
      align-items: center;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      overflow: hidden;
    }

    .qty-selector button {
      width: 40px;
      height: 40px;
      border: none;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .qty-selector button:hover:not(:disabled) {
      background: #f5f5f5;
      color: var(--color-primary);
    }

    .qty-selector button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .qty-selector span {
      min-width: 50px;
      text-align: center;
      font-weight: 600;
      border-left: 1px solid #e5e5e5;
      border-right: 1px solid #e5e5e5;
      padding: 8px 0;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }

    .btn-add-cart {
      flex: 1;
      height: 48px;
      border: none;
      border-radius: 50px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      box-shadow: 0 4px 12px rgba(139,0,0,0.2);
    }

    .btn-add-cart:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(139,0,0,0.35);
    }

    .btn-add-cart:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-wishlist {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: visible;
      padding: 0;
      flex-shrink: 0;
    }

    .btn-wishlist i {
      font-size: 1.1rem;
      color: #666;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-wishlist:hover {
      transform: scale(1.15);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9);
      background: rgba(255, 255, 255, 1);
    }

    .btn-wishlist:hover i {
      color: #D4AF37;
      filter: drop-shadow(0 0 6px rgba(212, 175, 55, 0.4));
    }

    .btn-wishlist:focus {
      outline: 2px solid #D4AF37;
      outline-offset: 2px;
    }

    .btn-wishlist.active {
      background: linear-gradient(135deg, #D4AF37, #b8960f);
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4), 0 3px 8px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .btn-wishlist.active i {
      color: white;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
    }

    .btn-wishlist.active:hover {
      background: linear-gradient(135deg, #b8960f, #D4AF37);
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.5), 0 5px 15px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
      transform: scale(1.2) rotate(-5deg);
    }

    .view-full-details {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      color: var(--color-primary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.2s ease;
      border-top: 1px solid var(--color-border-light);
      margin-top: 4px;
    }

    .view-full-details:hover {
      gap: 12px;
    }
  `]
})
export class QuickViewModalComponent implements OnInit {
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  private productService = inject(ProductService);

  // Using Angular 17+ input signals
  product = input<any>(null);
  isOpen = input<boolean>(false);

  @Output() close = new EventEmitter<void>();

  quantity = signal(1);
  selectedSize = signal('');
  isAddingToCart = signal(false);

  ngOnInit(): void {
    const p = this.product();
    if (p?.sizes?.length > 0) {
      this.selectedSize.set(p.sizes[0]);
    } else {
      this.selectedSize.set('Free Size');
    }
  }

  getStars(): number[] {
    const rating = this.product()?.rating || 0;
    return Array(Math.floor(rating)).fill(0);
  }

  discountPercent(): number {
    return 0;
  }

  hasDiscount(): boolean {
    return false;
  }

  displayPrice(): number {
    const p = this.product();
    if (!p) return 0;
    return p.price || 0;
  }

  availableSizes(): string[] {
    const p = this.product();
    if (!p) return ['Free Size'];
    return p.sizes?.length > 0 ? p.sizes : ['Free Size'];
  }

  primaryImage(): string {
    const p = this.product();
    if (!p) return '';
    if (p.images?.length > 0) {
      const img = p.images[0];
      if (img.startsWith('http://') || img.startsWith('https://')) {
        return img;
      }
      return this.productService.getImageUrl(img);
    }
    return 'https://via.placeholder.com/400x500?text=No+Image';
  }

  isInWishlist(): boolean {
    const p = this.product();
    if (!p) return false;
    return this.wishlistService.isInWishlist(p._id);
  }

  incrementQuantity(): void {
    const p = this.product();
    if (p && this.quantity() < p.stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  onAddToCart(): void {
    const p = this.product();
    if (!p) return;

    if (!this.authService.currentUser()) {
      this.onClose();
      return;
    }

    this.isAddingToCart.set(true);

    const cartProduct: Product = {
      _id: p._id,
      name: p.name,
      description: p.description || '',
      price: p.price || 0,
      category: p.category,
      images: p.images,
      sizes: p.sizes || ['Free Size'],
      stock: p.stock,
      isFeatured: p.isPremium,
      createdAt: new Date()
    };

    this.cartService.addToCart(cartProduct, this.quantity(), this.selectedSize()).subscribe({
      next: (response) => {
        if (response.success) {
          this.isAddingToCart.set(false);
          this.onClose();
        }
      },
      error: () => {
        this.isAddingToCart.set(false);
      }
    });
  }

  onToggleWishlist(): void {
    const p = this.product();
    if (!p) return;

    if (!this.authService.currentUser()) {
      this.onClose();
      return;
    }
    this.wishlistService.toggleWishlist(p._id).subscribe();
  }

  onClose(): void {
    this.quantity.set(1);
    this.isAddingToCart.set(false);
    this.close.emit();
  }
}
