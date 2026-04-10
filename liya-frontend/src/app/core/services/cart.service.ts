import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Product } from './product.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/environment';

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  itemCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private ns = inject(NotificationService);
  private apiUrl = environment.apiUrl + '/cart';
  
  // Use signal for reactive state management
  private _cartItems = signal<CartItem[]>([]);
  private _loading = signal<boolean>(false);
  
  // Public readonly signals
  readonly cartItems = this._cartItems.asReadonly();
  readonly loading = this._loading.asReadonly();
  
  // Computed values
  cartCount = computed(() => 
    this._cartItems().reduce((total, item) => total + item.quantity, 0)
  );
  
  cartTotal = computed(() => 
    this._cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  constructor() {
    // Load cart on service init if user is logged in
    if (this.authService.isLoggedIn()) {
      this.loadCart();
    }
  }

  // Load cart from backend
  loadCart(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    this._loading.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Transform backend items to frontend format and filter out items with null products
          const items: CartItem[] = response.data.items
            .filter((item: any) => item.product && item.product._id)
            .map((item: any) => ({
              product: item.product,
              quantity: item.quantity,
              size: item.size
            }));
          this._cartItems.set(items);
        }
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
      }
    });
  }

  // Add to cart via API
  addToCart(product: Product, quantity: number = 1, size: string): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      this.ns.warning('Please login to add items to cart');
      return of({ success: false, message: 'Please login to add to cart' });
    }

    return this.http.post<any>(this.apiUrl, { 
      productId: product._id, 
      quantity, 
      size 
    }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          const items: CartItem[] = response.data.items.map((item: any) => ({
            product: item.product,
            quantity: item.quantity,
            size: item.size
          }));
          this._cartItems.set(items);
          this.ns.success('Item added to cart');
        }
      }),
      catchError((error) => {
        this.ns.error(error.error?.message || 'Failed to add item to cart');
        return of(error);
      })
    );
  }

  // Remove from cart via API
  removeFromCart(productId: string, size: string): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return of({ success: false, message: 'Please login' });
    }

    return this.http.delete<any>(`${this.apiUrl}/${productId}?size=${encodeURIComponent(size)}`).pipe(
      tap((response) => {
        if (response.success && response.data) {
          const items: CartItem[] = response.data.items.map((item: any) => ({
            product: item.product,
            quantity: item.quantity,
            size: item.size
          }));
          this._cartItems.set(items);
          this.ns.info('Item removed from cart');
        }
      }),
      catchError((error) => {
        this.ns.error('Failed to remove item from cart');
        return of(error);
      })
    );
  }

  // Update cart item quantity via API
  updateQuantity(productId: string, size: string, quantity: number): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return of({ success: false, message: 'Please login' });
    }

    return this.http.put<any>(`${this.apiUrl}/${productId}`, { quantity, size }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          const items: CartItem[] = response.data.items.map((item: any) => ({
            product: item.product,
            quantity: item.quantity,
            size: item.size
          }));
          this._cartItems.set(items);
        }
      }),
      catchError((error) => {
        console.error('Error updating cart:', error);
        return of(error);
      })
    );
  }

  // Clear entire cart
  clearCart(): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return of({ success: false, message: 'Please login' });
    }

    return this.http.delete<any>(this.apiUrl).pipe(
      tap((response) => {
        if (response.success) {
          this._cartItems.set([]);
        }
      }),
      catchError((error) => {
        console.error('Error clearing cart:', error);
        return of(error);
      })
    );
  }

  // Clear cart locally (on logout - no API call)
  clearCartLocal(): void {
    this._cartItems.set([]);
  }

  // Get cart items (for local use)
  getCartItems(): CartItem[] {
    return this._cartItems();
  }
}
