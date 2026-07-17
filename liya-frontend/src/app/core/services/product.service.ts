import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/environment';

export interface Review {
  _id?: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  stock: number;
  isFeatured: boolean;
  isNewArrival?: boolean;
  reviews?: Review[];
  averageRating?: number;
  numReviews?: number;
  createdAt: Date;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private ns = inject(NotificationService);

  constructor(private http: HttpClient) {}

  // Helper to get full image URL - uses relative path for proxy
  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const base = environment.imageBaseUrl || '';
    const path = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
    return base + path;
  }

  getProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<ProductsResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.category && filters.category !== 'all') {
        params = params.set('category', filters.category);
      }
      if (filters.minPrice) {
        params = params.set('minPrice', filters.minPrice.toString());
      }
      if (filters.maxPrice) {
        params = params.set('maxPrice', filters.maxPrice.toString());
      }
      if (filters.sort) {
        params = params.set('sort', filters.sort);
      }
      if (filters.search) {
        params = params.set('search', filters.search);
      }
      if (filters.page) {
        params = params.set('page', filters.page.toString());
      }
      if (filters.limit) {
        params = params.set('limit', filters.limit.toString());
      }
    }

    return this.http.get<ProductsResponse>(this.apiUrl, { params });
  }

  getFeaturedProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/featured`);
  }

  getNewArrivals(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/new-arrivals`);
  }

  // Alias for getProducts without filters (for admin)
  getAllProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(this.apiUrl);
  }

  getProductsByCategory(category: string): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/category/${category}`);
  }

  getProduct(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  createProduct(data: Partial<Product>, files?: File[]): Observable<ProductResponse> {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.price !== undefined && data.price !== null) formData.append('price', data.price.toString());
    if (data.category) formData.append('category', data.category);
    if (data.stock !== undefined && data.stock !== null) formData.append('stock', data.stock.toString());
    if (data.sizes) formData.append('sizes', JSON.stringify(data.sizes));
    if (data.isFeatured !== undefined) formData.append('isFeatured', data.isFeatured.toString());
    if (data.isNewArrival !== undefined) formData.append('isNewArrival', data.isNewArrival.toString());
    if (data.images && data.images.length > 0) formData.append('existingImages', JSON.stringify(data.images));
    if (files && files.length > 0) files.forEach(file => formData.append('images', file));
    return this.http.post<ProductResponse>(this.apiUrl, formData, { withCredentials: true }).pipe(
      tap(res => { if (res.success) this.ns.success('Product added successfully'); })
    );
  }

  updateProduct(id: string, data: Partial<Product>, files?: File[]): Observable<ProductResponse> {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.price !== undefined && data.price !== null) formData.append('price', data.price.toString());
    if (data.category) formData.append('category', data.category);
    if (data.stock !== undefined && data.stock !== null) formData.append('stock', data.stock.toString());
    if (data.sizes) formData.append('sizes', JSON.stringify(data.sizes));
    if (data.isFeatured !== undefined) formData.append('isFeatured', data.isFeatured.toString());
    if (data.isNewArrival !== undefined) formData.append('isNewArrival', data.isNewArrival.toString());
    if (data.images && data.images.length > 0) formData.append('existingImages', JSON.stringify(data.images));
    if (files && files.length > 0) files.forEach(file => formData.append('images', file));
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, formData, { withCredentials: true }).pipe(
      tap(res => { if (res.success) this.ns.success('Product updated successfully'); })
    );
  }

  deleteProduct(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      tap(res => { if (res.success) this.ns.success('Product deleted successfully'); })
    );
  }

  getLowStockProducts(threshold = 5): Observable<{ success: boolean; data: Product[]; count: number }> {
    return this.http.get<{ success: boolean; data: Product[]; count: number }>(
      `${this.apiUrl}/low-stock?threshold=${threshold}`, { withCredentials: true }
    );
  }

  // Admin method to get products with category breakdown
  getAdminProducts(): Observable<{
    success: boolean;
    data: {
      products: Product[];
      categoryBreakdown: { _id: string; count: number; totalStock: number }[];
    }
  }> {
    return this.http.get<{
      success: boolean;
      data: {
        products: Product[];
        categoryBreakdown: { _id: string; count: number; totalStock: number }[];
      }
    }>(`${this.apiUrl}/admin/all`, { withCredentials: true });
  }

  addReview(productId: string, rating: number, comment: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${productId}/reviews`, { rating, comment }, { withCredentials: true });
  }

  deleteReview(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${productId}/reviews`, { withCredentials: true });
  }

  // Public method to get dashboard stats (no auth required)
  getStats(): Observable<{
    success: boolean;
    data: {
      totalUsers: number;
      totalProducts: number;
      totalOrders: number;
      revenue: number;
      categoryBreakdown: { _id: string; count: number; totalStock: number }[];
    }
  }> {
    return this.http.get<{
      success: boolean;
      data: {
        totalUsers: number;
        totalProducts: number;
        totalOrders: number;
        revenue: number;
        categoryBreakdown: { _id: string; count: number; totalStock: number }[];
      }
    }>(`${this.apiUrl}/stats`);
  }
}
