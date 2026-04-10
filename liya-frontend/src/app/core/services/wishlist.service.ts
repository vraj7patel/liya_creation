import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from './product.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface Wishlist {
  _id: string;
  user: string;
  items: WishlistItem[];
  itemCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private ns = inject(NotificationService);
  private apiUrl = environment.apiUrl + '/wishlist';
  
  // Use signal for reactive state management
  private _wishlist = signal<Wishlist | null>(null);
  private _loading = signal<boolean>(false);
  
  // Public readonly signals
  readonly wishlist = this._wishlist.asReadonly();
  readonly loading = this._loading.asReadonly();
  
  // Computed value for wishlist count
  readonly wishlistCount = computed(() => {
    return this._wishlist()?.items?.length || 0;
  });

  constructor() {
    // Load wishlist only if user is logged in
    if (this.authService.isLoggedIn()) {
      this.loadWishlist();
    }
  }

  // Load wishlist from backend (only if logged in)
  loadWishlist(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    this._loading.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        if (response.success) {
          this._wishlist.set(response.data);
        }
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
      }
    });
  }

  // Add product to wishlist
  addToWishlist(productId: string): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      this.ns.warning('Please login to add to wishlist');
      return of({ success: false, message: 'Please login to add to wishlist' });
    }

    return this.http.post<any>(this.apiUrl, { productId }).pipe(
      tap((response) => {
        if (response.success) {
          this._wishlist.set(response.data);
          this.ns.success('Added to wishlist');
        }
      }),
      catchError((error) => {
        this.ns.error('Failed to add to wishlist');
        return of(error);
      })
    );
  }

  // Remove product from wishlist
  removeFromWishlist(productId: string): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return of({ success: false, message: 'Please login' });
    }

    return this.http.delete<any>(`${this.apiUrl}/${productId}`).pipe(
      tap((response) => {
        if (response.success) {
          this._wishlist.set(response.data);
          this.ns.info('Removed from wishlist');
        }
      }),
      catchError((error) => {
        this.ns.error('Failed to remove from wishlist');
        return of(error);
      })
    );
  }

  // Toggle product in wishlist
  toggleWishlist(productId: string): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return of({ success: false, message: 'Please login to add to wishlist' });
    }

    if (this.isInWishlist(productId)) {
      return this.removeFromWishlist(productId);
    } else {
      return this.addToWishlist(productId);
    }
  }

  // Check if product is in wishlist
  isInWishlist(productId: string): boolean {
    const wishlist = this._wishlist();
    if (!wishlist || !wishlist.items) return false;
    return wishlist.items.some(item => item.product?._id === productId);
  }

  // Clear entire wishlist
  clearWishlist(): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return of({ success: false, message: 'Please login' });
    }

    return this.http.delete<any>(this.apiUrl).pipe(
      tap((response) => {
        if (response.success) {
          this._wishlist.set(response.data);
        }
      })
    );
  }

  // Clear wishlist locally (on logout - no API call)
  clearWishlistLocal(): void {
    this._wishlist.set(null);
  }

  // Get wishlist items
  getWishlistItems(): WishlistItem[] {
    return this._wishlist()?.items || [];
  }
}
