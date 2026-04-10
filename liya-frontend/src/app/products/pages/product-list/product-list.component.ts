import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../core/services/product.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { PremiumProductCardComponent, PremiumProduct } from '../../../shared/components/premium-product-card/premium-product-card.component';
import { QuickViewModalComponent } from '../../../shared/components/quick-view-modal/quick-view-modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PremiumProductCardComponent, QuickViewModalComponent],
  template: `
    <div class="products-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="container">
          <div class="header-content">
            <h1>{{ categoryTitle }}</h1>
            <p>{{ totalProducts }} products found</p>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="products-layout">
          <!-- Sidebar Filters -->
          <aside class="filters hide-mobile">
            <div class="filter-card">
              <div class="filter-section">
                <h3>Categories</h3>
                <ul class="category-list">
                  <li>
                    <a [routerLink]="['/products']" [class.active]="!currentCategory || currentCategory === 'all'">
                      <span class="category-icon"><i class="fas fa-th"></i></span>
                      All Products
                    </a>
                  </li>
                  <li>
                    <a [routerLink]="['/products/category/Lehengas']" [class.active]="currentCategory === 'Lehengas'">
                      <span class="category-icon"><i class="fas fa-tshirt"></i></span>
                      Lehengas
                    </a>
                  </li>
                  <li>
                    <a [routerLink]="['/products/category/saree']" [class.active]="currentCategory === 'saree'">
                      <span class="category-icon"><i class="fas fa-female"></i></span>
                      saree
                    </a>
                  </li>
                  <li>
                    <a [routerLink]="['/products/category/Gowns']" [class.active]="currentCategory === 'Gowns'">
                      <span class="category-icon"><i class="fas fa-user-tie"></i></span>
                      Gowns
                    </a>
                  </li>
                  <li>
                    <a [routerLink]="['/products/category/Kurtis']" [class.active]="currentCategory === 'Kurtis'">
                      <span class="category-icon"><i class="fas fa-tshirt"></i></span>
                      Kurtis
                    </a>
                  </li>
                </ul>
              </div>

              <div class="filter-section">
                <h3>Price Range</h3>
                <div class="price-inputs">
                  <div class="price-field">
                    <span class="price-symbol">₹</span>
                    <input type="number" [(ngModel)]="minPrice" placeholder="Min" (input)="applyFilters()">
                  </div>
                  <span class="price-separator">-</span>
                  <div class="price-field">
                    <span class="price-symbol">₹</span>
                    <input type="number" [(ngModel)]="maxPrice" placeholder="Max" (input)="applyFilters()">
                  </div>
                </div>
              </div>

              <div class="filter-section">
                <h3>Sort By</h3>
                <div class="select-wrapper">
                  <select [(ngModel)]="sortBy" (change)="applyFilters()">
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <i class="fas fa-chevron-down"></i>
                </div>
              </div>

              @if (activeFilterCount > 0) {
                <button class="clear-btn" (click)="clearFilters()">
                  <i class="fas fa-times"></i> Clear Filters
                </button>
              }
            </div>
          </aside>

          <!-- Mobile Filter Toggle -->
          <div class="mobile-filters hide-desktop hide-tablet">
            <button class="filter-toggle" (click)="toggleMobileFilters()">
              <i class="fas fa-filter"></i> Filters
              @if (activeFilterCount > 0) { <span class="filter-badge">{{ activeFilterCount }}</span> }
            </button>
            <div class="select-wrapper">
              <select [(ngModel)]="sortBy" (change)="applyFilters()">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <i class="fas fa-chevron-down"></i>
            </div>
          </div>

          <!-- Mobile Filter Panel -->
          @if (mobileFiltersOpen) {
            <div class="mobile-filter-panel">
              <div class="mfp-header">
                <span>Filters</span>
                <button (click)="toggleMobileFilters()"><i class="fas fa-times"></i></button>
              </div>
              <div class="mfp-body">
                <div class="filter-section">
                  <h3>Price Range</h3>
                  <div class="price-inputs">
                    <div class="price-field">
                      <span class="price-symbol">₹</span>
                      <input type="number" [(ngModel)]="minPrice" placeholder="Min" (input)="applyFilters()">
                    </div>
                    <span class="price-separator">-</span>
                    <div class="price-field">
                      <span class="price-symbol">₹</span>
                      <input type="number" [(ngModel)]="maxPrice" placeholder="Max" (input)="applyFilters()">
                    </div>
                  </div>
                </div>
                @if (activeFilterCount > 0) {
                  <button class="clear-btn" (click)="clearFilters()"><i class="fas fa-times"></i> Clear Filters</button>
                }
              </div>
            </div>
          }

          <!-- Products Main -->
          <main class="products-main">
            @if (loading) {
              <div class="loading">Loading products...</div>
            } @else if (products.length === 0) {
              <div class="no-products">
                <div class="no-products-icon">
                  <i class="fas fa-search"></i>
                </div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria</p>
                <a routerLink="/products" class="btn btn-primary">View All Products</a>
              </div>
            } @else {
              <div class="products-grid">
                @for (product of products; track product._id) {
                  <!-- Premium Product Card -->
                  <app-premium-product-card
                    [product]="convertToPremiumProduct(product)"
                    [colorTheme]="getColorTheme(product)"
                    (quickView)="onQuickView($event)"
                    (addToCart)="onAddToCart($event)"
                  />
                }
              </div>

              <!-- Pagination -->
              @if (totalPages > 1) {
                <div class="pagination">
                  <button class="page-btn nav-btn" (click)="goToPage(page - 1)" [disabled]="page === 1">
                    <i class="fas fa-chevron-left"></i>
                  </button>

                  @for (p of pageNumbers; track p) {
                    @if (p === -1) {
                      <span class="page-dots">…</span>
                    } @else {
                      <button class="page-btn" [class.active]="p === page" (click)="goToPage(p)">
                        {{ p }}
                      </button>
                    }
                  }

                  <button class="page-btn nav-btn" (click)="goToPage(page + 1)" [disabled]="page === totalPages">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
              }
            }
          </main>
        </div>
      </div>
    </div>

    <!-- Quick View Modal -->
    <app-quick-view-modal
      [product]="selectedProduct()"
      [isOpen]="quickViewOpen()"
      (close)="closeQuickView()"
    />
  `,
  styles: [`
    .products-page {
      min-height: 100vh;
      background: var(--color-bg);
    }

    .page-header {
      background: linear-gradient(135deg, var(--color-forest) 0%, #0f2922 100%);
      padding: var(--spacing-2xl) 0;
      margin-bottom: var(--spacing-2xl);
    }

    .header-content {
      h1 {
        font-family: var(--font-heading);
        font-size: var(--font-size-4xl);
        color: white;
        margin-bottom: var(--spacing-sm);
      }

      p {
        font-size: var(--font-size-base);
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
      }
    }

    .products-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: var(--spacing-2xl);
      padding-bottom: var(--spacing-3xl);
    }

    /* Filters */
    .filter-card {
      background: var(--color-bg-light);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      border: 1px solid var(--color-border-light);
      position: sticky;
      top: 100px;
    }

    .filter-section {
      margin-bottom: var(--spacing-xl);

      &:last-child {
        margin-bottom: 0;
      }

      h3 {
        font-family: var(--font-heading);
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text);
        margin-bottom: var(--spacing-lg);
        padding-bottom: var(--spacing-md);
        border-bottom: 1px solid var(--color-border-light);
        text-transform: uppercase;
        letter-spacing: var(--letter-spacing-wide);
      }
    }

    .category-list {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: var(--spacing-sm);

        a {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          color: var(--color-text);
          text-decoration: none;
          font-size: var(--font-size-sm);
          transition: all var(--transition-smooth);

          .category-icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-bg);
            border-radius: var(--radius-md);
            color: var(--color-text-light);
            transition: all var(--transition-smooth);
          }

          &:hover, &.active {
            background: var(--color-primary);
            color: white;

            .category-icon {
              background: rgba(255, 255, 255, 0.2);
              color: white;
            }
          }

          &.active {
            background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
            color: white;
            box-shadow: var(--shadow-glow);
          }
        }
      }
    }

    .price-inputs {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .price-field {
      flex: 1;
      position: relative;

      .price-symbol {
        position: absolute;
        left: var(--spacing-md);
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
      }

      input {
        width: 100%;
        padding: var(--spacing-md);
        padding-left: var(--spacing-xl);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        transition: all var(--transition-smooth);

        &:focus {
          outline: none;
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.15);
        }
      }
    }

    .price-separator {
      color: var(--color-text-muted);
    }

    .select-wrapper {
      position: relative;

      select {
        width: 100%;
        padding: var(--spacing-md);
        padding-right: var(--spacing-2xl);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        color: var(--color-text);
        background: white;
        cursor: pointer;
        appearance: none;
        transition: all var(--transition-smooth);

        &:focus {
          outline: none;
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.15);
        }
      }

      i {
        position: absolute;
        right: var(--spacing-md);
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-text-muted);
        pointer-events: none;
      }
    }

    /* Mobile Filters */
    .mobile-filters {
      display: none;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);

      .filter-toggle {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md) var(--spacing-lg);
        background: var(--color-bg-light);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        color: var(--color-text);
        cursor: pointer;
        transition: all var(--transition-smooth);
        position: relative;

        &:hover { border-color: var(--color-secondary); }

        .filter-badge {
          background: var(--color-primary);
          color: white;
          font-size: 11px;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .select-wrapper { flex: 1; }
    }

    .mobile-filter-panel {
      background: white;
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-xl);
      margin-bottom: var(--spacing-xl);
      overflow: hidden;
      grid-column: 1 / -1;

      .mfp-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 20px;
        border-bottom: 1px solid var(--color-border-light);
        font-weight: 600;
        font-size: 15px;
        color: var(--color-text);

        button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-muted);
          font-size: 16px;
          &:hover { color: var(--color-primary); }
        }
      }

      .mfp-body { padding: 16px 20px; }
    }

    .clear-btn {
      width: 100%;
      padding: 10px;
      margin-top: 8px;
      background: #fff5f5;
      color: var(--color-primary);
      border: 1px solid #ffd0d0;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;

      &:hover { background: #ffe0e0; border-color: var(--color-primary); }
    }

    /* ── Product List Area ── */

    /* No Products */
    .no-products {
      text-align: center;
      padding: var(--spacing-4xl) var(--spacing-xl);
      background: var(--color-bg-light);
      border-radius: var(--radius-xl);

      .no-products-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto var(--spacing-xl);
        background: var(--color-bg);
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 2rem;
          color: var(--color-text-muted);
        }
      }

      h3 {
        font-family: var(--font-heading);
        font-size: var(--font-size-2xl);
        color: var(--color-text);
        margin-bottom: var(--spacing-sm);
      }

      p {
        font-size: var(--font-size-base);
        color: var(--color-text-light);
        margin-bottom: var(--spacing-xl);
      }
    }

    /* Pagination */
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: var(--spacing-2xl);
      padding-top: var(--spacing-xl);
      border-top: 1px solid var(--color-border-light);
    }

    .page-btn {
      min-width: 40px;
      height: 40px;
      padding: 0 10px;
      border: 1.5px solid var(--color-border);
      background: white;
      border-radius: 10px;
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover:not(:disabled):not(.active) {
        border-color: var(--color-secondary);
        color: var(--color-primary);
        background: rgba(212, 165, 116, 0.08);
      }

      &.active {
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
        border-color: var(--color-primary);
        color: white;
        box-shadow: 0 4px 12px rgba(139, 0, 0, 0.25);
      }

      &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      &.nav-btn { font-size: 12px; }
    }

    .page-dots {
      min-width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted);
      font-size: 16px;
      letter-spacing: 2px;
    }

    /* Loading */
    .loading {
      text-align: center;
      padding: var(--spacing-4xl);
      font-size: var(--font-size-lg);
      color: var(--color-text-light);
    }

    /* Responsive */
    @media (max-width: 1200px) {
    }

    @media (max-width: 992px) {
      .products-layout {
        grid-template-columns: 1fr;
      }

      .filters {
        display: none;
      }

      .mobile-filters {
        display: flex;
      }
    }

    @media (max-width: 576px) {
      .page-header {
        padding: var(--spacing-xl) 0;
      }

      .header-content h1 {
        font-size: var(--font-size-3xl);
      }
    }

    @media (max-width: 380px) {
    }
  `]
})
export class ProductListComponent implements OnInit {
  public productService = inject(ProductService);
  public wishlistService = inject(WishlistService);
  public cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  products: Product[] = [];
  loading = true;
  currentCategory = '';
  categoryTitle = 'All Products';
  isNewArrivalsFilter = false;
  minPrice?: number;
  maxPrice?: number;
  sortBy = 'newest';
  page = 1;
  totalPages = 1;
  totalProducts = 0;
  mobileFiltersOpen = false;

  // Quick view state
  quickViewOpen = signal(false);
  selectedProduct = signal<Product | null>(null);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentCategory = params['category'] || '';
      this.categoryTitle = this.currentCategory ? this.currentCategory : 'All Products';
      this.loadProducts();
    });
    this.route.queryParams.subscribe(params => {
      if (params['newArrivals']) {
        this.categoryTitle = 'New Arrivals';
        this.isNewArrivalsFilter = true;
      } else {
        this.isNewArrivalsFilter = false;
      }
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;

    if (this.isNewArrivalsFilter) {
      this.productService.getNewArrivals().subscribe({
        next: (res: any) => {
          this.products = res.data;
          this.totalProducts = res.data.length;
          this.totalPages = 1;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
      return;
    }
    
    const filters: any = {
      page: this.page,
      limit: 12
    };

    if (this.currentCategory) {
      filters.category = this.currentCategory;
    }
    if (this.minPrice) {
      filters.minPrice = this.minPrice;
    }
    if (this.maxPrice) {
      filters.maxPrice = this.maxPrice;
    }
    if (this.sortBy) {
      filters.sort = this.sortBy;
    }

    this.productService.getProducts(filters).subscribe({
      next: (response: any) => {
        this.products = response.data;
        this.totalPages = response.pagination?.pages || 1;
        this.totalProducts = response.pagination?.total || response.data.length;
        this.loading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadProducts();
  }

  clearFilters(): void {
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.sortBy = 'newest';
    this.page = 1;
    this.loadProducts();
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.minPrice) count++;
    if (this.maxPrice) count++;
    if (this.sortBy !== 'newest') count++;
    return count;
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages || p === this.page) return;
    this.page = p;
    this.loadProducts();
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.page;
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (current > 3) pages.push(-1); // left ellipsis

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push(-1); // right ellipsis
    pages.push(total);

    return pages;
  }

  toggleMobileFilters(): void {
    this.mobileFiltersOpen = !this.mobileFiltersOpen;
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

  // Convert Product to PremiumProduct for the card component
  convertToPremiumProduct(product: Product): PremiumProduct {
    return {
      _id: product._id,
      name: product.name,
      images: product.images,
      originalPrice: product.price,
      discountedPrice: product.price,
      isPremium: product.isFeatured,
      stock: product.stock,
      category: product.category,
      description: product.description,
      sizes: product.sizes,
      rating: product.averageRating ?? 0,
      reviewsCount: product.numReviews ?? 0
    };
  }

  // Get color theme based on category
  getColorTheme(product: Product): 'gold' | 'royal-blue' | 'emerald' {
    // Alternate themes based on category or index
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

  // Handle quick view event
  onQuickView(productId: string): void {
    const product = this.products.find(p => p._id === productId);
    if (product) {
      this.selectedProduct.set(product);
      this.quickViewOpen.set(true);
    }
  }

  // Close quick view modal
  closeQuickView(): void {
    this.quickViewOpen.set(false);
    this.selectedProduct.set(null);
  }

  // Handle add to cart event
  onAddToCart(event: { productId: string; quantity: number; size: string }): void {
    console.log('Added to cart:', event);
  }
}
