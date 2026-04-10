import { Injectable, signal, inject, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationService } from './notification.service';
import { CartService } from './cart.service';
import { WishlistService } from './wishlist.service';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);
  private ns = inject(NotificationService);
  private injector = inject(Injector);

  private get cartSvc() { return this.injector.get(CartService); }
  private get wishSvc() { return this.injector.get(WishlistService); }

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  setCurrentUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  register(data: { name: string; email: string; password: string; phone: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.data?.user) {
          this.currentUser.set(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      })
    );
  }

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.data?.user) {
          this.currentUser.set(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.ns.success('Login successful');
          this.cartSvc.loadCart();
          this.wishSvc.loadWishlist();
        }
      })
    );
  }

  logout(): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/auth/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.currentUser.set(null);
        localStorage.removeItem('user');
        this.cartSvc.clearCartLocal();
        this.wishSvc.clearWishlistLocal();
        this.ns.info('Logged out successfully');
      })
    );
  }

  getCurrentUser(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/auth/me`, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.data?.user) {
          this.currentUser.set(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      })
    );
  }

  updateProfile(data: { name: string; phone: string }, avatarFile?: File): Observable<AuthResponse> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('phone', data.phone);
    if (avatarFile) formData.append('avatar', avatarFile);
    return this.http.put<AuthResponse>(`${this.apiUrl}/auth/profile`, formData, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.data?.user) {
          this.currentUser.set(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      })
    );
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}/auth/change-password`, data, {
      withCredentials: true
    });
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  getApiUrl(): string {
    return this.apiUrl;
  }
}
