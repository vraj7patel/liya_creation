import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order.service';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="orders-page">
      <div class="container">
        <div class="page-header">
          <h1>My Orders</h1>
          <a routerLink="/track-order" class="btn btn-outline">
            <i class="fas fa-search"></i> Track Order
          </a>
        </div>

        @if (loading) {
          <div class="loading">Loading orders...</div>
        } @else if (orders.length === 0) {
          <div class="no-orders">
            <i class="fas fa-shopping-bag"></i>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <a routerLink="/products" class="btn btn-primary">Start Shopping</a>
          </div>
        } @else {
          <div class="orders-list">
            @for (order of orders; track order._id) {
              <div class="order-card">
                <div class="order-header">
                  <div class="order-id-section">
                    <span class="order-label">Order ID:</span>
                    <span class="order-id">{{ order._id }}</span>
                    <button class="copy-btn" (click)="copyOrderId(order._id)" title="Copy Order ID">
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                  <span class="order-status" [class]="order.orderStatus.toLowerCase()">
                    {{ order.orderStatus }}
                  </span>
                </div>

                <div class="order-body">
                  <div class="order-items-preview">
                    @for (item of order.products.slice(0, 3); track item.product) {
                      <div class="item-thumb">
                        @if (item.image) {
                          <img [src]="item.image" [alt]="item.name">
                        } @else {
                          <div class="no-image"><i class="fas fa-image"></i></div>
                        }
                      </div>
                    }
                    @if (order.products.length > 3) {
                      <div class="more-items">+{{ order.products.length - 3 }}</div>
                    }
                  </div>

                  <div class="order-info">
                    <div class="info-item">
                      <span class="label">Items:</span>
                      <span class="value">{{ order.products.length }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Total:</span>
                      <span class="value price">₹{{ order.totalAmount | number:'1.0-0' }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Date:</span>
                      <span class="value">{{ order.createdAt | date:'mediumDate' }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Payment:</span>
                      <span class="value">{{ order.paymentStatus }}</span>
                    </div>
                  </div>
                </div>

                <div class="order-actions">
                  <a [routerLink]="['/user/order', order._id]" class="btn btn-outline btn-sm">
                    <i class="fas fa-eye"></i> View Details
                  </a>
                  <a [routerLink]="['/track-order']" [queryParams]="{orderId: order._id}" class="btn btn-outline btn-sm">
                    <i class="fas fa-map-marker-alt"></i> Track Order
                  </a>
                </div>
              </div>
            }
          </div>
        }

        @if (showCopyMessage) {
          <div class="copy-toast">Order ID copied to clipboard!</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .orders-page { padding: 40px 0; min-height: 100vh; background: var(--color-bg); }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .page-header h1 { font-size: 32px; }
    
    .btn { background: #d63384; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
    .btn-outline { background: transparent; border: 2px solid #d63384; color: #d63384; }
    .btn-outline:hover { background: #d63384; color: white; }
    .btn-sm { padding: 8px 16px; font-size: 14px; }

    .loading { text-align: center; padding: 60px; color: #666; }

    .no-orders { text-align: center; padding: 80px 20px; background: white; border-radius: 12px; }
    .no-orders i { font-size: 4rem; color: #ddd; margin-bottom: 20px; }
    .no-orders h2 { margin-bottom: 10px; }
    .no-orders p { color: #666; margin-bottom: 20px; }

    .orders-list { display: flex; flex-direction: column; gap: 20px; }
    .order-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .order-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #f9f9f9; border-bottom: 1px solid #eee; }
    .order-id-section { display: flex; align-items: center; gap: 10px; }
    .order-label { color: #666; font-size: 14px; }
    .order-id { font-family: monospace; font-size: 14px; font-weight: 600; color: #333; }
    .copy-btn { background: none; border: none; cursor: pointer; color: #d63384; padding: 5px; }
    .copy-btn:hover { color: #b02a6b; }

    .order-status { padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .order-status.pending { background: #fff3cd; color: #856404; }
    .order-status.confirmed { background: #cce5ff; color: #004085; }
    .order-status.shipped { background: #d4edda; color: #155724; }
    .order-status.delivered { background: #d4edda; color: #155724; }
    .order-status.cancelled { background: #f8d7da; color: #721c24; }

    .order-body { display: flex; justify-content: space-between; padding: 20px; }
    .order-items-preview { display: flex; gap: 10px; }
    .item-thumb { width: 60px; height: 60px; border-radius: 8px; overflow: hidden; background: #f5f5f5; }
    .item-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .item-thumb .no-image { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #ccc; }
    .more-items { width: 60px; height: 60px; border-radius: 8px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #666; }

    .order-info { display: flex; gap: 30px; align-items: center; }
    .info-item { display: flex; flex-direction: column; }
    .info-item .label { font-size: 12px; color: #999; margin-bottom: 4px; }
    .info-item .value { font-weight: 600; color: #333; }
    .info-item .value.price { color: #d63384; font-size: 18px; }

    .order-actions { padding: 15px 20px; border-top: 1px solid #eee; display: flex; gap: 10px; }

    .copy-toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: #333; color: white; padding: 12px 24px; border-radius: 8px; animation: fadeIn 0.3s; z-index: 1000; }
    @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

    @media (max-width: 768px) {
      .order-body { flex-direction: column; gap: 16px; }
      .order-info { flex-wrap: wrap; gap: 12px; }
      .order-header { flex-direction: column; align-items: flex-start; gap: 10px; }
      .order-id-section { flex-wrap: wrap; }
      .order-id { font-size: 12px; word-break: break-all; }
      .order-actions { flex-wrap: wrap; }
      .order-actions .btn { flex: 1; justify-content: center; min-width: 120px; }
      .page-header { flex-direction: column; align-items: flex-start; gap: 12px; }
      .page-header h1 { font-size: 24px; }
    }
    @media (max-width: 480px) {
      .orders-page { padding: 20px 0; }
      .order-items-preview { flex-wrap: wrap; }
      .info-item .value.price { font-size: 16px; }
    }
  `]
})
export class UserOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  
  orders: Order[] = [];
  loading = false;
  showCopyMessage = false;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: (response: any) => {
        this.orders = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
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
