# PremiumProductCard Component

A luxury e-commerce product card component for Angular 17+ with glassmorphism design, smooth animations, and premium styling.

## Features

- 🎨 3 Color Themes: Gold Luxury, Royal Blue, Emerald Green
- ✨ Glassmorphism/gradient background with elevated shadows
- 🖼️ Optimized image loading with skeleton loader
- 🏷️ "LIMITED EDITION" badge with shimmer effect
- 💰 Price display with strikethrough original + discount badge
- 👁️ Quick view modal trigger
- 🛒 Add to Cart with loading spinner + quantity stepper
- 📱 Fully responsive (desktop/tablet/mobile)
- ♿ ARIA accessibility labels
- 🔄 OnPush change detection
- 📡 Angular Signals for reactive state

## Installation

The component is already created in your project at:
```
src/app/shared/components/premium-product-card/
```

## Quick Start

### 1. Import the Component

In your component (e.g., product-list.component.ts):

```
typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PremiumProductCardComponent, PremiumProduct } from '../../shared/components/premium-product-card/premium-product-card.component';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, PremiumProductCardComponent],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent {
  productService = inject(ProductService);
  
  // Sample premium products
  products: PremiumProduct[] = [
    {
      _id: '1',
      name: 'Royal Banarasi Silk Saree',
      images: ['/uploads/products/saree1.jpg'],
      originalPrice: 25000,
      discountedPrice: 18750,
      discountPercent: 25,
      isPremium: true,
      stock: 5,
      category: 'Sarees',
      rating: 4.8,
      reviewsCount: 42,
      sizes: ['Free Size']
    },
    // Add more products...
  ];

  // Handle quick view
  openQuickView(productId: string): void {
    console.log('Quick view for:', productId);
    // Implement your quick view modal logic
  }

  // Handle add to cart
  handleAddToCart(event: { productId: string; quantity: number; size: string }): void {
    console.log('Added to cart:', event);
  }
}
```

### 2. Use in Template

```
html
<!-- Basic Usage -->
<app-premium-product-card 
  [product]="product"
  (quickView)="openQuickView($event)"
  (addToCart)="handleAddToCart($event)">
</app-premium-product-card>

<!-- With Custom Theme -->
<app-premium-product-card 
  [product]="product"
  [colorTheme]="'royal-blue'"
  (quickView)="openQuickView($event)"
  (addToCart)="handleAddToCart($event)">
</app-premium-product-card>

<!-- Grid of Products -->
<div class="products-grid">
  <app-premium-product-card 
    *ngFor="let product of products; trackBy: trackByFn"
    [product]="product"
    [colorTheme]="'gold'"
    (quickView)="openQuickView($event)"
    (addToCart)="handleAddToCart($event)">
  </app-premium-product-card>
</div>
```

## API

### Inputs

| Input | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `product` | `PremiumProduct` | Yes | - | Product data object |
| `colorTheme` | `'gold' \| 'royal-blue' \| 'emerald'` | No | `'gold'` | Color theme |
| `showQuickView` | `boolean` | No | `true` | Show quick view button |
| `showAddToCart` | `boolean` | No | `true` | Show add to cart button |
| `enableQuantitySelector` | `boolean` | No | `true` | Show quantity stepper |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `quickView` | `EventEmitter<string>` | Emits product ID when quick view is clicked |
| `addToCart` | `EventEmitter<{productId, quantity, size}>` | Emits cart data when add to cart is clicked |

### PremiumProduct Interface

```
typescript
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
```

## Styling

The component uses SCSS with CSS custom properties. The styles are scoped to the component but inherit from your global design system.

### Customizing Themes

You can override the theme colors in your global styles:

```
scss
// In styles.scss
.premium-card.theme-gold {
  // Override gold theme colors
  --gold-primary: #your-color;
}
```

## Integration with Your Services

### CartService Integration

The component automatically integrates with your existing `CartService`:

```
typescript
// Inside the component
this.cartService.addToCart(cartProduct, this.quantity(), this.selectedSize());
```

### ProductService Integration

Images are automatically processed through your `ProductService.getImageUrl()` method.

## Responsive Breakpoints

- Mobile: < 576px
- Tablet: 576px - 992px
- Desktop: > 992px

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly

## Example: Complete Product List Page

```
typescript
// product-list.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PremiumProductCardComponent, PremiumProduct } from '../../shared/components/premium-product-card/premium-product-card.component';
import { ProductService, Product } from '../../core/services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, PremiumProductCardComponent],
  template: `
    <div class="page-container">
      <h1>Premium Collection</h1>
      
      @if (loading()) {
        <div class="loading">Loading...</div>
      } @else {
        <div class="products-grid">
          @for (product of products(); track product._id) {
            <app-premium-product-card
              [product]="convertToPremium(product)"
              [colorTheme]="'gold'"
              (quickView)="openQuickView($event)"
              (addToCart)="handleAddToCart($event)"
            />
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  
  products = signal<PremiumProduct[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products.set(response.data as PremiumProduct[]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  convertToPremium(product: Product): PremiumProduct {
    return {
      _id: product._id,
      name: product.name,
      images: product.images,
      originalPrice: product.price,
      discountedPrice: product.price,
      isPremium: product.isFeatured,
      stock: product.stock,
      category: product.category,
      sizes: product.sizes
    };
  }

  openQuickView(productId: string): void {
    // Implement your quick view modal
  }

  handleAddToCart(event: { productId: string; quantity: number; size: string }): void {
    // Toast notification or other feedback
  }
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Internal use only - Liya Creation E-commerce
