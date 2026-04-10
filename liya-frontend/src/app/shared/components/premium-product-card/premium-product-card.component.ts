import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  signal, 
  computed,
  ChangeDetectionStrategy,
  inject,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { Product, ProductService } from '../../../core/services/product.service';

// ============================================================================
// Types
// ============================================================================

export type ColorTheme = 'gold' | 'royal-blue' | 'emerald';

export interface PremiumProduct {
  _id: string;
  name: string;
  images: string[];
  originalPrice: number;
  discountedPrice: number;
  discountPercent?: number;
  isPremium: boolean;
  stock: number;
  category: string;
  rating?: number;
  reviewsCount?: number;
  description?: string;
  sizes?: string[];
}

// ============================================================================
// Component
// ============================================================================

@Component({
  selector: 'app-premium-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './premium-product-card.component.html',
  styleUrls: ['./premium-product-card.component.scss']
})
export class PremiumProductCardComponent implements OnInit {
  // Services
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  // Inputs
  @Input({ required: true }) product!: PremiumProduct;
  @Input() colorTheme: ColorTheme = 'gold';
  @Input() showQuickView: boolean = true;
  @Input() showAddToCart: boolean = true;
  @Input() showWishlist: boolean = true;
  @Input() enableQuantitySelector: boolean = true;

  // Outputs
  @Output() quickView = new EventEmitter<string>();
  @Output() addToCart = new EventEmitter<{ productId: string; quantity: number; size: string }>();
  @Output() toggleWishlist = new EventEmitter<string>();

  // Signals for reactive state
  readonly isHovered = signal(false);
  readonly isButtonClicked = signal(false);
  readonly quantity = signal(1);
  readonly isAddingToCart = signal(false);
  readonly selectedSize = signal<string>('');
  readonly imageLoaded = signal(false);
  readonly wishlistAnimating = signal(false);
  readonly addToCartSuccess = signal(false);

  // Computed values
  readonly discountPercent = computed(() => {
    if (!this.product.discountPercent && this.product.originalPrice && this.product.discountedPrice) {
      return Math.round(((this.product.originalPrice - this.product.discountedPrice) / this.product.originalPrice) * 100);
    }
    return this.product.discountPercent || 0;
  });

  readonly hasDiscount = computed(() => 
    this.discountPercent() > 0 || this.product.discountedPrice < this.product.originalPrice
  );

  readonly isOutOfStock = computed(() => this.product.stock <= 0);

  readonly displayPrice = computed(() => 
    this.product.discountedPrice || this.product.originalPrice
  );

  readonly displayOriginalPrice = computed(() => 
    this.hasDiscount() ? this.product.originalPrice : null
  );

  readonly availableSizes = computed(() => 
    this.product.sizes && this.product.sizes.length > 0 
      ? this.product.sizes 
      : ['Free Size']
  );

  readonly primaryImage = computed(() => {
    if (this.product.images && this.product.images.length > 0) {
      const img = this.product.images[0];
      if (img.startsWith('http://') || img.startsWith('https://')) {
        return img;
      }
      return this.productService.getImageUrl(img);
    }
    return 'https://via.placeholder.com/400x500?text=No+Image';
  });

  readonly fallbackImage = computed(() => 
    'https://via.placeholder.com/400x500?text=Premium+Product'
  );

  readonly themeClass = computed(() => `theme-${this.colorTheme}`);

  readonly starRating = computed(() => {
    const rating = this.product.rating || 0;
    return {
      full: Math.floor(rating),
      hasHalf: rating % 1 >= 0.5,
      empty: 5 - Math.ceil(rating)
    };
  });

  // Check if product is in wishlist
  readonly isInWishlist = computed(() => 
    this.wishlistService.isInWishlist(this.product._id)
  );

  // Check if user is logged in
  readonly isLoggedIn = computed(() => 
    this.authService.currentUser() !== null
  );

  // Wishlist tooltip text
  readonly wishlistTooltip = computed(() =>
    this.isInWishlist() ? 'Remove from Wishlist' : 'Add to Wishlist'
  );

  // Free size logic: if no standard sizes (S,M,L,XL,XXL), show "Free Size"
  private readonly STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;

  readonly isFreeSize = computed(() => 
    !!this.product.sizes?.length && 
    !this.product.sizes.some(size => this.STANDARD_SIZES.includes(size.toUpperCase() as any))
  );

  // ============================================================================
  // Lifecycle
  // ============================================================================

  ngOnInit(): void {
    if (this.availableSizes().length > 0) {
      this.selectedSize.set(this.availableSizes()[0]);
    }
  }

  // ============================================================================
  // Public Methods
  // ============================================================================

  onMouseEnter(): void {
    this.isHovered.set(true);
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
  }

  onImageLoad(): void {
    this.imageLoaded.set(true);
  }

  onImageError(): void {
    this.imageLoaded.set(false);
  }

  triggerCardScale(): void {
    this.isButtonClicked.set(true);
    // Reset after 800ms animation
    setTimeout(() => {
      this.isButtonClicked.set(false);
    }, 800);
  }

  incrementQuantity(): void {
    if (this.quantity() < this.product.stock) {
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

  onQuickView(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.quickView.emit(this.product._id);
  }

  // ========== WISHLIST METHODS ==========
  onToggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    // Check if user is logged in
    if (!this.isLoggedIn()) {
      // Redirect to login page
      this.router.navigate(['/auth/login']);
      return;
    }
    
    // Trigger animation
    this.wishlistAnimating.set(true);
    
    this.wishlistService.toggleWishlist(this.product._id).subscribe({
      next: () => {
        this.toggleWishlist.emit(this.product._id);
      },
      error: (err) => {
        console.error('Error toggling wishlist:', err);
      }
    });
    
    // Reset animation after pulse completes
    setTimeout(() => {
      this.wishlistAnimating.set(false);
    }, 600);
  }

  // ========== BUY NOW METHOD ==========
  onBuyNow(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    // Trigger card scale animation
    this.triggerCardScale();

    // Check if user is logged in
    if (!this.isLoggedIn()) {
      // Redirect to login page
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.isOutOfStock() || this.isAddingToCart()) {
      return;
    }

    this.isAddingToCart.set(true);
    this.addToCartSuccess.set(false);

    // Use the buyNow API to create order directly
    this.orderService.buyNow({
      productId: this.product._id,
      quantity: this.quantity(),
      size: this.selectedSize()
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.addToCartSuccess.set(true);
          this.addToCart.emit({
            productId: this.product._id,
            quantity: this.quantity(),
            size: this.selectedSize()
          });
          
          // Reset quantity after successful add
          this.quantity.set(1);
          
          // Navigate to checkout page with order ID
          this.router.navigate(['/checkout'], { 
            queryParams: { orderId: response.data.orderId } 
          });
        }
        this.isAddingToCart.set(false);
      },
      error: (err) => {
        console.error('Error processing buy now:', err);
        this.isAddingToCart.set(false);
      }
    });
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    // Trigger card scale animation
    this.triggerCardScale();

    // Check if user is logged in
    if (!this.isLoggedIn()) {
      // Redirect to login page
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.isOutOfStock() || this.isAddingToCart()) {
      return;
    }

    this.isAddingToCart.set(true);
    this.addToCartSuccess.set(false);

    // Create product object for cart
    const cartProduct: Product = {
      _id: this.product._id,
      name: this.product.name,
      description: this.product.description || '',
      price: this.displayPrice(),
      category: this.product.category,
      images: this.product.images,
      sizes: this.product.sizes || ['Free Size'],
      stock: this.product.stock,
      isFeatured: this.product.isPremium,
      createdAt: new Date()
    };

    // Subscribe to the addToCart observable
    this.cartService.addToCart(cartProduct, this.quantity(), this.selectedSize()).subscribe({
      next: (response) => {
        if (response.success) {
          this.addToCartSuccess.set(true);
          this.addToCart.emit({
            productId: this.product._id,
            quantity: this.quantity(),
            size: this.selectedSize()
          });
          
          // Reset quantity after successful add
          this.quantity.set(1);
          
          // Hide success message after 2 seconds
          setTimeout(() => {
            this.addToCartSuccess.set(false);
          }, 2000);
        }
        this.isAddingToCart.set(false);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.isAddingToCart.set(false);
      }
    });
  }

  // ============================================================================
  // Accessibility
  // ============================================================================

  getAriaLabel(): string {
    return `${this.product.name}, ${this.hasDiscount() ? 'discounted price' : 'price'} ${this.displayPrice()} rupees`;
  }

  trackByFn(index: number): number {
    return index;
  }
}
