import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Order {
  _id: string;
  user: string;
  products: Array<{
    product: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
  }>;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OrderStats {
  success: boolean;
  data: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    revenue: number;
    recentOrders: Order[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  // Track order by ID (public - no auth required)
  trackOrder(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/track/${orderId}`);
  }

  createOrder(data: {
    products: Array<{ product: string; quantity: number; size: string }>;
    shippingAddress: Order['shippingAddress'];
    paymentMethod: string;
  }): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, data);
  }

  // Buy Now - Direct checkout for single product
  buyNow(data: { productId: string; quantity: number; size: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/buy-now`, data);
  }

  getMyOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.apiUrl}/my-orders`);
  }

  getOrder(id: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`);
  }

  getAllOrders(filters?: { status?: string; page?: number; limit?: number }): Observable<OrdersResponse> {
    let url = this.apiUrl;
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        params.set('status', filters.status);
      }
      if (filters.page) {
        params.set('page', filters.page.toString());
      }
      if (filters.limit) {
        params.set('limit', filters.limit.toString());
      }
    }
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    return this.http.get<OrdersResponse>(url);
  }

  updateOrderStatus(id: string, orderStatus: string): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${this.apiUrl}/${id}/status`, { orderStatus });
  }

  getOrderStats(): Observable<OrderStats> {
    return this.http.get<OrderStats>(`${this.apiUrl}/stats`);
  }

  getOrderStatusBreakdown(): Observable<{ success: boolean; data: { _id: string; count: number }[] }> {
    return this.http.get<{ success: boolean; data: { _id: string; count: number }[] }>(`${this.apiUrl}/status-breakdown`, { withCredentials: true });
  }

  // Admin methods
  getAdminOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.apiUrl}/admin/all`);
  }
}
