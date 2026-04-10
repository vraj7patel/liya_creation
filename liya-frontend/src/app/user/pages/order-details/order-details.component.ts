import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="order-details-page">
      <div class="container">
        @if (loading) {
          <div class="loading">Loading order details...</div>
        } @else if (error) {
          <div class="error-container">
            <div class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              <h2>Order Not Found</h2>
              <p>{{ error }}</p>
              <a routerLink="/user/orders" class="btn btn-primary">
                <i class="fas fa-arrow-left"></i> Back to Orders
              </a>
            </div>
          </div>
        } @else if (order) {
          <!-- Page Header -->
          <div class="page-header">
            <a routerLink="/user/orders" class="back-link">
              <i class="fas fa-arrow-left"></i> Back to Orders
            </a>
            <div class="header-content">
              <h1>Order Details</h1>
              <div class="order-meta">
                <span class="order-id">
                  <strong>Order ID:</strong> {{ order._id }}
                  <button class="copy-btn" (click)="copyOrderId(order._id)" title="Copy Order ID">
                    <i class="fas fa-copy"></i>
                  </button>
                </span>
                <span class="order-date">Placed on: {{ order.createdAt | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>

          <div class="order-content">
            <div class="order-main">
              <!-- Order Status Card -->
              <div class="status-card" [class]="order.orderStatus.toLowerCase()">
                <div class="status-header">
                  <div class="status-icon">
                    <i [class]="getStatusIcon(order.orderStatus)"></i>
                  </div>
                  <div class="status-info">
                    <h3>{{ getStatusLabel(order.orderStatus) }}</h3>
                    <span class="status-badge" [class]="order.orderStatus.toLowerCase()">
                      {{ order.orderStatus }}
                    </span>
                  </div>
                </div>
                <div class="status-actions">
                  <a [routerLink]="['/track-order']" [queryParams]="{orderId: order._id}" class="btn btn-outline btn-sm">
                    <i class="fas fa-map-marker-alt"></i> Track Order
                  </a>
                </div>
              </div>

              <!-- Ordered Items -->
              <div class="items-card">
                <div class="card-header">
                  <h3><i class="fas fa-shopping-bag"></i> Ordered Items</h3>
                  <span class="item-count">{{ order.products.length }} items</span>
                </div>
                
                <div class="items-list">
                  @for (item of order.products; track item.product) {
                    <div class="order-item">
                      <div class="item-image">
                        @if (item.image) {
                          <img [src]="item.image" [alt]="item.name">
                        } @else {
                          <div class="no-image">
                            <i class="fas fa-image"></i>
                          </div>
                        }
                      </div>
                      <div class="item-details">
                        <h4 class="item-name">{{ item.name }}</h4>
                        <div class="item-meta">
                          <span class="meta-item">
                            <i class="fas fa-hashtag"></i> Size: {{ item.size }}
                          </span>
                          <span class="meta-item">
                            <i class="fas fa-times"></i> Qty: {{ item.quantity }}
                          </span>
                        </div>
                        <span class="item-price">₹{{ item.price | number:'1.0-0' }} each</span>
                      </div>
                      <div class="item-total">
                        ₹{{ item.price * item.quantity | number:'1.0-0' }}
                      </div>
                    </div>
                  }
                </div>

                <div class="order-summary">
                  <div class="summary-row">
                    <span>Subtotal</span>
                    <span>₹{{ order.totalAmount | number:'1.0-0' }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Shipping</span>
                    <span class="free">FREE</span>
                  </div>
                  <div class="summary-row total">
                    <span>Total Paid</span>
                    <span>₹{{ order.totalAmount | number:'1.0-0' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="order-sidebar">
              <!-- Payment Info -->
              <div class="info-card">
                <h3><i class="fas fa-credit-card"></i> Payment</h3>
                <div class="info-content">
                  <div class="info-row">
                    <span class="label">Method</span>
                    <span class="value">{{ order.paymentMethod }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Status</span>
                    <span class="value payment-status" [class]="order.paymentStatus.toLowerCase()">
                      {{ order.paymentStatus }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Shipping Address -->
              <div class="info-card">
                <h3><i class="fas fa-shipping-fast"></i> Shipping Address</h3>
                <div class="address-content">
                  <p class="name">{{ order.shippingAddress.fullName }}</p>
                  <p class="address">{{ order.shippingAddress.address }}</p>
                  <p class="city">{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }}</p>
                  <p class="pincode">{{ order.shippingAddress.pincode }}</p>
                  <p class="phone">
                    <i class="fas fa-phone"></i> {{ order.shippingAddress.phone }}
                  </p>
                </div>
              </div>

              <!-- Order Timeline -->
              <div class="info-card">
                <h3><i class="fas fa-history"></i> Order Timeline</h3>
                <div class="timeline">
                  <div class="timeline-item">
                    <div class="timeline-dot active"></div>
                    <div class="timeline-content">
                      <h5>Order Placed</h5>
                      <p>{{ order.createdAt | date:'medium' }}</p>
                    </div>
                  </div>
                  @if (order.updatedAt && order.updatedAt !== order.createdAt) {
                    <div class="timeline-item">
                      <div class="timeline-dot"></div>
                      <div class="timeline-content">
                        <h5>Last Updated</h5>
                        <p>{{ order.updatedAt | date:'medium' }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        }

        @if (showCopyMessage) {
          <div class="copy-toast">Order ID copied to clipboard!</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .order-details-page { padding: 40px 0; min-height: 100vh; background: var(--color-bg); }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

    /* Loading & Error */
    .loading { text-align: center; padding: 60px; color: #666; font-size: 18px; }
    .error-container { text-align: center; padding: 80px 20px; }
    .error-message { background: white; padding: 40px; border-radius: 12px; display: inline-block; }
    .error-message i { font-size: 4rem; color: #dc3545; margin-bottom: 20px; }
    .error-message h2 { margin-bottom: 10px; }
    .error-message p { color: #666; margin-bottom: 20px; }

    /* Page Header */
    .page-header { margin-bottom: 30px; }
    .back-link { display: inline-flex; align-items: center; gap: 8px; color: #666; text-decoration: none; margin-bottom: 15px; font-size: 14px; transition: color 0.2s; }
    .back-link:hover { color: #d63384; }
    .header-content { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
    .header-content h1 { font-size: 28px; font-weight: 600; }
    .order-meta { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; }
    .order-id { display: flex; align-items: center; gap: 8px; font-size: 14px; }
    .order-id strong { color: #666; }
    .copy-btn { background: none; border: none; cursor: pointer; color: #d63384; padding: 5px; }
    .copy-btn:hover { color: #b02a6b; }
    .order-date { color: #666; font-size: 14px; }

    /* Order Content Layout */
    .order-content { display: grid; grid-template-columns: 1fr 350px; gap: 30px; }
    @media (max-width: 992px) {
      .order-content { grid-template-columns: 1fr; }
    }

    /* Status Card */
    .status-card { background: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .status-header { display: flex; align-items: center; gap: 15px; }
    .status-icon { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
    .status-card.pending .status-icon { background: #fff3cd; color: #ffc107; }
    .status-card.confirmed .status-icon { background: #cce5ff; color: #0dcaf0; }
    .status-card.shipped .status-icon { background: #d1e7dd; color: #198754; }
    .status-card.delivered .status-icon { background: #d1e7dd; color: #198754; }
    .status-card.cancelled .status-icon { background: #f8d7da; color: #dc3545; }
    
    .status-info h3 { margin: 0 0 5px 0; font-size: 18px; }
    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status-badge.pending { background: #fff3cd; color: #856404; }
    .status-badge.confirmed { background: #cce5ff; color: #004085; }
    .status-badge.shipped { background: #d4edda; color: #155724; }
    .status-badge.delivered { background: #d4edda; color: #155724; }
    .status-badge.cancelled { background: #f8d7da; color: #721c24; }

    /* Buttons */
    .btn { background: #d63384; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; transition: all 0.2s; }
    .btn:hover { background: #b02a6b; }
    .btn-outline { background: transparent; border: 2px solid #d63384; color: #d63384; }
    .btn-outline:hover { background: #d63384; color: white; }
    .btn-sm { padding: 8px 16px; font-size: 13px; }

    /* Items Card */
    .items-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .card-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #f9f9f9; border-bottom: 1px solid #eee; }
    .card-header h3 { margin: 0; font-size: 18px; display: flex; align-items: center; gap: 10px; }
    .item-count { color: #666; font-size: 14px; }

    .items-list { padding: 0 20px; }
    .order-item { display: flex; align-items: center; gap: 20px; padding: 20px 0; border-bottom: 1px solid #eee; }
    .order-item:last-child { border-bottom: none; }
    
    .item-image { width: 80px; height: 80px; border-radius: 8px; overflow: hidden; background: #f5f5f5; flex-shrink: 0; }
    .item-image img { width: 100%; height: 100%; object-fit: cover; }
    .no-image { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #ccc; font-size: 1.5rem; }
    
    .item-details { flex: 1; }
    .item-name { margin: 0 0 8px 0; font-size: 16px; font-weight: 500; }
    .item-meta { display: flex; gap: 15px; margin-bottom: 8px; }
    .meta-item { font-size: 13px; color: #666; display: flex; align-items: center; gap: 5px; }
    .item-price { font-size: 14px; color: #666; }
    
    .item-total { font-size: 18px; font-weight: 600; color: #333; }

    /* Order Summary */
    .order-summary { background: #f9f9f9; padding: 20px; border-top: 1px solid #eee; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #666; }
    .summary-row.total { border-top: 2px solid #ddd; margin-top: 10px; padding-top: 15px; font-size: 18px; font-weight: 600; color: #333; }
    .summary-row.total span:last-child { color: #d63384; }
    .free { color: #198754 !important; font-weight: 500; }

    /* Sidebar */
    .order-sidebar { display: flex; flex-direction: column; gap: 25px; }
    
    .info-card { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .info-card h3 { margin: 0 0 20px 0; font-size: 16px; display: flex; align-items: center; gap: 10px; color: #333; }
    
    .info-content { display: flex; flex-direction: column; gap: 12px; }
    .info-row { display: flex; justify-content: space-between; }
    .info-row .label { color: #666; font-size: 14px; }
    .info-row .value { font-weight: 500; }
    .payment-status { padding: 2px 10px; border-radius: 20px; font-size: 12px; }
    .payment-status.paid { background: #d4edda; color: #155724; }
    .payment-status.pending { background: #fff3cd; color: #856404; }
    .payment-status.failed { background: #f8d7da; color: #721c24; }

    /* Address */
    .address-content p { margin: 0 0 8px 0; color: #666; line-height: 1.5; font-size: 14px; }
    .address-content .name { font-weight: 600; color: #333; font-size: 16px; }
    .address-content .phone { display: flex; align-items: center; gap: 8px; margin-top: 10px; }

    /* Timeline */
    .timeline { display: flex; flex-direction: column; gap: 15px; }
    .timeline-item { display: flex; gap: 15px; position: relative; }
    .timeline-item:not(:last-child)::before { content: ''; position: absolute; left: 4px; top: 16px; bottom: -15px; width: 2px; background: #eee; }
    .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: #d63384; flex-shrink: 0; margin-top: 5px; }
    .timeline-dot.active { background: #198754; }
    .timeline-content h5 { margin: 0 0 5px 0; font-size: 14px; }
    .timeline-content p { margin: 0; font-size: 12px; color: #666; }

    /* Toast */
    .copy-toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: #333; color: white; padding: 12px 24px; border-radius: 8px; animation: fadeIn 0.3s; z-index: 1000; }
    @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

    @media (max-width: 768px) {
      .header-content { flex-direction: column; align-items: flex-start; }
      .order-meta { flex-direction: column; align-items: flex-start; gap: 10px; }
      .order-item { flex-wrap: wrap; }
      .item-details { order: 2; min-width: 100%; }
      .item-total { order: 3; }
    }
  `]
})
export class OrderDetailsComponent implements OnInit {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  
  order: Order | null = null;
  loading = true;
  error = '';
  showCopyMessage = false;

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(orderId);
    } else {
      this.loading = false;
      this.error = 'Order ID not found';
    }
  }

  loadOrder(orderId: string): void {
    this.loading = true;
    this.orderService.getOrder(orderId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.order = response.data;
        } else {
          this.error = response.message || 'Order not found';
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Unable to load order details. Please try again.';
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'Pending': 'Order Placed',
      'Confirmed': 'Order Confirmed',
      'Shipped': 'Shipped',
      'Delivered': 'Delivered',
      'Cancelled': 'Cancelled'
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'Pending': 'fas fa-shopping-cart',
      'Confirmed': 'fas fa-check-circle',
      'Shipped': 'fas fa-truck',
      'Delivered': 'fas fa-box-open',
      'Cancelled': 'fas fa-times-circle'
    };
    return icons[status] || 'fas fa-circle';
  }

  copyOrderId(orderId: string): void {
    navigator.clipboard.writeText(orderId).then(() => {
      this.showCopyMessage = true;
      setTimeout(() => {
        this.showCopyMessage = false;
      }, 2000);
    });
  }
}
