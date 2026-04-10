import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService, OrderResponse } from '../../core/services/order.service';

interface OrderStatus {
  key: string;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="track-order-page">
      <div class="page-header">
        <div class="container">
          <h1>Track Your Order</h1>
          <p>Stay updated on your order status</p>
        </div>
      </div>

      <div class="container">
        <div class="track-content">
          <!-- Search Form -->
          <div class="track-form-section" *ngIf="!orderDetails">
            <div class="search-illustration">
              <i class="fas fa-search-location"></i>
            </div>
            <h2>Enter Your Order Details</h2>
            <p class="subtitle">Enter your order ID to track your shipment</p>
            
            <form (ngSubmit)="trackOrder()" class="search-form">
              <div class="input-group">
                <i class="fas fa-barcode"></i>
                <input 
                  type="text" 
                  id="orderId" 
                  [(ngModel)]="trackingInput" 
                  name="orderId"
                  placeholder="Enter your order ID"
                  required
                >
              </div>
              <button type="submit" class="btn btn-primary btn-lg" [disabled]="!trackingInput || isLoading">
                @if (isLoading) {
                  <span class="spinner"></span>
                  Tracking...
                } @else {
                  <i class="fas fa-search"></i> Track Order
                }
              </button>
            </form>

            @if (errorMessage) {
              <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i>
                {{ errorMessage }}
              </div>
            }

            <div class="help-text">
              <i class="fas fa-info-circle"></i>
              <span>You can find your order ID in your order confirmation email or in My Orders section</span>
            </div>
          </div>

          <!-- Order Details -->
          <div class="order-details-section" *ngIf="orderDetails">
            <button class="btn btn-outline back-btn" (click)="resetTracking()">
              <i class="fas fa-arrow-left"></i> Track Another Order
            </button>

            <!-- Order Status Card -->
            <div class="status-card" [class]="getStatusClass(orderDetails.orderStatus)">
              <div class="status-header">
                <div class="status-icon">
                  <i [class]="getStatusIcon(orderDetails.orderStatus)"></i>
                </div>
                <div class="status-text">
                  <h3>{{ getStatusLabel(orderDetails.orderStatus) }}</h3>
                  <p>Order ID: {{ orderDetails._id }}</p>
                  <p class="order-date">Placed on: {{ orderDetails.createdAt | date:'mediumDate' }}</p>
                </div>
              </div>
              
              <!-- Status Progress Bar -->
              <div class="status-progress-bar">
                <div class="progress-fill" [style.width.%]="getProgressPercentage()"></div>
              </div>
              
              <div class="status-description">
                <p>{{ getStatusDescription(orderDetails.orderStatus) }}</p>
              </div>

              <div class="estimated-delivery" *ngIf="orderDetails.orderStatus !== 'Delivered' && orderDetails.orderStatus !== 'Cancelled'">
                <i class="fas fa-truck"></i>
                <span>Estimated delivery: <strong>{{ getEstimatedDelivery() }}</strong></span>
              </div>
            </div>

            <!-- Processing Status -->
            <div class="processing-info" *ngIf="orderDetails.orderStatus === 'Pending'">
              <div class="processing-card">
                <i class="fas fa-hourglass-half"></i>
                <div class="processing-text">
                  <h4>Order Processing</h4>
                  <p>Your order is being reviewed. We'll confirm it shortly.</p>
                </div>
              </div>
            </div>

            <div class="processing-info" *ngIf="orderDetails.orderStatus === 'Confirmed'">
              <div class="processing-card confirmed">
                <i class="fas fa-check-circle"></i>
                <div class="processing-text">
                  <h4>Order Confirmed</h4>
                  <p>Your order has been confirmed and will be shipped soon.</p>
                </div>
              </div>
            </div>

            <div class="processing-info" *ngIf="orderDetails.orderStatus === 'Shipped'">
              <div class="processing-card shipped">
                <i class="fas fa-box-open"></i>
                <div class="processing-text">
                  <h4>On The Way</h4>
                  <p>Your package is on its way to you!</p>
                </div>
              </div>
            </div>

            <!-- Graphical Timeline -->
            <div class="tracking-progress">
              <h4><i class="fas fa-route"></i> Order Progress</h4>
              <div class="progress-timeline">
                @for (status of statusSteps; track status.key; let i = $index) {
                  <div class="progress-step" 
                       [class.completed]="isStatusCompleted(status.key)"
                       [class.current]="isCurrentStatus(status.key)"
                       [class.pending]="!isStatusCompleted(status.key) && !isCurrentStatus(status.key)">
                    <div class="step-indicator">
                      <div class="step-circle">
                        @if (isStatusCompleted(status.key)) {
                          <i class="fas fa-check"></i>
                        } @else if (isCurrentStatus(status.key)) {
                          <i [class]="status.icon"></i>
                        } @else {
                          <span>{{ i + 1 }}</span>
                        }
                      </div>
                      @if (i < statusSteps.length - 1) {
                        <div class="step-line" [class.filled]="isStatusCompleted(status.key)"></div>
                      }
                    </div>
                    <div class="step-content">
                      <h5>{{ status.label }}</h5>
                      <p>{{ status.description }}</p>
                      @if (getStatusDate(status.key)) {
                        <span class="step-date">
                          <i class="fas fa-calendar-alt"></i>
                          {{ getStatusDate(status.key) | date:'medium' }}
                        </span>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Order Items -->
            <div class="order-card">
              <div class="card-header">
                <h4><i class="fas fa-shopping-bag"></i> Order Items</h4>
                <span class="item-count">{{ orderDetails.products?.length || 0 }} items</span>
              </div>
              
              <div class="order-items">
                @for (item of orderDetails.products; track item.product) {
                  <div class="item">
                    <div class="item-image">
                      @if (item.image) {
                        <img [src]="item.image" [alt]="item.name">
                      } @else {
                        <div class="no-image">
                          <i class="fas fa-image"></i>
                        </div>
                      }
                    </div>
                    <div class="item-info">
                      <span class="item-name">{{ item.name }}</span>
                      <span class="item-qty">Qty: {{ item.quantity }} | Size: {{ item.size }}</span>
                    </div>
                    <span class="item-price">₹{{ item.price * item.quantity | number:'1.0-0' }}</span>
                  </div>
                }
              </div>

              <div class="order-total">
                <span>Total Paid</span>
                <span class="total-amount">₹{{ orderDetails.totalAmount | number:'1.0-0' }}</span>
              </div>
            </div>

            <!-- Shipping Info -->
            <div class="shipping-info" *ngIf="orderDetails.shippingAddress">
              <h4><i class="fas fa-shipping-fast"></i> Shipping Address</h4>
              <div class="address-card">
                <p class="name">{{ orderDetails.shippingAddress.fullName }}</p>
                <p>{{ orderDetails.shippingAddress.address }}</p>
                <p>{{ orderDetails.shippingAddress.city }}, {{ orderDetails.shippingAddress.state }} - {{ orderDetails.shippingAddress.pincode }}</p>
                <p><i class="fas fa-phone"></i> {{ orderDetails.shippingAddress.phone }}</p>
              </div>
            </div>

            <!-- Order Timeline -->
            <div class="order-timeline">
              <h4><i class="fas fa-history"></i> Order Timeline</h4>
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <h5>Order Placed</h5>
                    <p>{{ orderDetails.createdAt | date:'medium' }}</p>
                  </div>
                </div>
                @if (orderDetails.orderStatus === 'Confirmed') {
                  <div class="timeline-item">
                    <div class="timeline-dot confirmed"></div>
                    <div class="timeline-content">
                      <h5>Order Confirmed</h5>
                      <p>Your order has been confirmed and is being prepared</p>
                    </div>
                  </div>
                }
                @if (orderDetails.orderStatus === 'Shipped') {
                  <div class="timeline-item">
                    <div class="timeline-dot shipped"></div>
                    <div class="timeline-content">
                      <h5>Shipped</h5>
                      <p>Your order has been shipped and is on its way</p>
                    </div>
                  </div>
                }
                @if (orderDetails.orderStatus === 'Delivered') {
                  <div class="timeline-item">
                    <div class="timeline-dot delivered"></div>
                    <div class="timeline-content">
                      <h5>Delivered</h5>
                      <p>Your order has been delivered successfully</p>
                    </div>
                  </div>
                }
                @if (orderDetails.updatedAt && orderDetails.updatedAt !== orderDetails.createdAt) {
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                      <h5>Last Updated</h5>
                      <p>{{ orderDetails.updatedAt | date:'medium' }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Help Section -->
          <div class="help-section">
            <h3>Need Help?</h3>
            <p>Contact our customer support for any queries related to your order</p>
            <a routerLink="/contact" class="btn btn-secondary">
              <i class="fas fa-headset"></i> Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .track-order-page { min-height: 100vh; background: var(--color-bg); }
    .page-header { background: linear-gradient(135deg, var(--color-forest) 0%, #0f2922 100%); padding: var(--spacing-3xl) 0; margin-bottom: var(--spacing-3xl); }
    .page-header h1 { font-family: var(--font-heading); font-size: var(--font-size-4xl); color: white; margin-bottom: var(--spacing-sm); }
    .page-header p { font-size: var(--font-size-base); color: rgba(255, 255, 255, 0.7); }
    .track-content { max-width: 800px; margin: 0 auto; padding-bottom: var(--spacing-4xl); }

    /* Search Section */
    .track-form-section { background: var(--color-bg-light); padding: var(--spacing-3xl); border-radius: var(--radius-2xl); text-align: center; }
    .search-illustration { font-size: 4rem; color: var(--color-secondary); margin-bottom: var(--spacing-lg); }
    .track-form-section h2 { font-family: var(--font-heading); font-size: var(--font-size-2xl); margin-bottom: var(--spacing-sm); }
    .subtitle { color: var(--color-text-light); margin-bottom: var(--spacing-xl); }
    .search-form { max-width: 500px; margin: 0 auto; }
    .input-group { position: relative; margin-bottom: var(--spacing-lg); }
    .input-group i { position: absolute; left: var(--spacing-lg); top: 50%; transform: translateY(-50%); color: var(--color-text-muted); }
    .input-group input { width: 100%; padding: var(--spacing-lg); padding-left: var(--spacing-3xl); border: 2px solid var(--color-border); border-radius: var(--radius-lg); font-size: var(--font-size-base); transition: all var(--transition-smooth); }
    .input-group input:focus { outline: none; border-color: var(--color-secondary); box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.2); }
    .help-text { display: flex; align-items: center; justify-content: center; gap: var(--spacing-sm); margin-top: var(--spacing-lg); color: var(--color-text-muted); font-size: var(--font-size-sm); }
    .alert { padding: 15px; border-radius: 4px; margin-top: 15px; }
    .alert-error { background: #fee; color: #e74c3c; display: flex; align-items: center; gap: 10px; justify-content: center; }

    /* Order Details */
    .back-btn { margin-bottom: var(--spacing-lg); }

    /* Status Card */
    .status-card { background: var(--color-bg-light); padding: var(--spacing-xl); border-radius: var(--radius-xl); margin-bottom: var(--spacing-lg); border-left: 4px solid; }
    .status-card.pending { border-color: #ffc107; }
    .status-card.Confirmed { border-color: #0dcaf0; }
    .status-card.Shipped { border-color: #198754; }
    .status-card.Delivered { border-color: #198754; }
    .status-card.Cancelled { border-color: #dc3545; }

    .status-header { display: flex; align-items: center; gap: var(--spacing-lg); }
    .status-icon { width: 60px; height: 60px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
    .status-card.pending .status-icon { background: #fff3cd; color: #ffc107; }
    .status-card.Confirmed .status-icon { background: #cff4fc; color: #0dcaf0; }
    .status-card.Shipped .status-icon { background: #d1e7dd; color: #198754; }
    .status-card.Delivered .status-icon { background: #d1e7dd; color: #198754; }
    .status-card.Cancelled .status-icon { background: #f8d7da; color: #dc3545; }

    .status-text h3 { font-family: var(--font-heading); font-size: var(--font-size-xl); margin-bottom: var(--spacing-xs); }
    .status-text p { color: var(--color-text-muted); font-size: var(--font-size-sm); margin: 0; }
    .status-text .order-date { color: var(--color-text-light); margin-top: var(--spacing-xs); }

    .status-progress-bar { height: 6px; background: var(--color-border); border-radius: 3px; margin: var(--spacing-lg) 0; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, var(--color-secondary), var(--color-primary)); border-radius: 3px; transition: width 0.5s ease; }
    .status-card.pending .progress-fill { width: 25%; background: #ffc107; }
    .status-card.Confirmed .progress-fill { width: 50%; background: #0dcaf0; }
    .status-card.Shipped .progress-fill { width: 75%; background: #198754; }
    .status-card.Delivered .progress-fill { width: 100%; background: #198754; }

    .status-description { padding: var(--spacing-md) 0; border-top: 1px solid var(--color-border-light); border-bottom: 1px solid var(--color-border-light); margin: var(--spacing-md) 0; }
    .status-description p { margin: 0; color: var(--color-text-light); }

    .estimated-delivery { display: flex; align-items: center; gap: var(--spacing-sm); margin-top: var(--spacing-lg); color: var(--color-text-light); }
    .estimated-delivery strong { color: var(--color-secondary); }

    /* Processing Info */
    .processing-info { margin-bottom: var(--spacing-lg); }
    .processing-card { display: flex; align-items: center; gap: var(--spacing-lg); padding: var(--spacing-lg); background: #fff3cd; border-radius: var(--radius-lg); border-left: 4px solid #ffc107; }
    .processing-card.confirmed { background: #cff4fc; border-left-color: #0dcaf0; }
    .processing-card.shipped { background: #d1e7dd; border-left-color: #198754; }
    .processing-card i { font-size: 2rem; color: #ffc107; }
    .processing-card.confirmed i { color: #0dcaf0; }
    .processing-card.shipped i { color: #198754; }
    .processing-text h4 { font-family: var(--font-heading); margin-bottom: var(--spacing-xs); }
    .processing-text p { margin: 0; color: var(--color-text-light); font-size: var(--font-size-sm); }

    /* Progress Timeline */
    .tracking-progress { background: var(--color-bg-light); padding: var(--spacing-xl); border-radius: var(--radius-xl); margin-bottom: var(--spacing-lg); }
    .tracking-progress h4 { font-family: var(--font-heading); margin-bottom: var(--spacing-xl); display: flex; align-items: center; gap: var(--spacing-sm); }
    .progress-timeline { display: flex; flex-direction: column; }
    .progress-step { display: flex; gap: var(--spacing-lg); }
    .step-indicator { display: flex; flex-direction: column; align-items: center; }
    .step-circle { width: 40px; height: 40px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-weight: var(--font-weight-bold); z-index: 1; transition: all var(--transition-smooth); }
    .progress-step.completed .step-circle { background: var(--color-success); color: white; }
    .progress-step.current .step-circle { background: var(--color-secondary); color: white; animation: pulse 2s infinite; }
    .progress-step.pending .step-circle { background: var(--color-bg); color: var(--color-text-muted); border: 2px solid var(--color-border); }
    @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(212, 165, 116, 0.4); } 50% { box-shadow: 0 0 0 10px rgba(212, 165, 116, 0); } }
    .step-line { width: 2px; height: 40px; background: var(--color-border); margin: var(--spacing-xs) 0; }
    .step-line.filled { background: var(--color-success); }
    .step-content { flex: 1; padding-bottom: var(--spacing-lg); }
    .step-content h5 { font-family: var(--font-heading); margin-bottom: var(--spacing-xs); }
    .progress-step.completed .step-content h5 { color: var(--color-success); }
    .progress-step.current .step-content h5 { color: var(--color-secondary); }
    .step-content p { font-size: var(--font-size-sm); color: var(--color-text-light); margin: 0; }
    .step-date { font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--spacing-xs); display: block; }
    .step-date i { margin-right: 5px; }

    /* Order Card */
    .order-card { background: var(--color-bg-light); padding: var(--spacing-xl); border-radius: var(--radius-xl); margin-bottom: var(--spacing-lg); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); padding-bottom: var(--spacing-md); border-bottom: 1px solid var(--color-border-light); }
    .card-header h4 { font-family: var(--font-heading); display: flex; align-items: center; gap: var(--spacing-sm); }
    .item-count { font-size: var(--font-size-sm); color: var(--color-text-muted); }
    .item { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md) 0; border-bottom: 1px solid var(--color-border-light); }
    .item:last-child { border-bottom: none; }
    .item-image { width: 60px; height: 60px; border-radius: var(--radius-md); overflow: hidden; background: var(--color-bg); }
    .item-image img { width: 100%; height: 100%; object-fit: cover; }
    .no-image { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); }
    .item-info { flex: 1; display: flex; flex-direction: column; }
    .item-name { font-weight: var(--font-weight-medium); }
    .item-qty { font-size: var(--font-size-sm); color: var(--color-text-light); }
    .item-price { font-weight: var(--font-weight-semibold); }
    .order-total { display: flex; justify-content: space-between; padding-top: var(--spacing-lg); margin-top: var(--spacing-md); border-top: 2px solid var(--color-border); font-family: var(--font-heading); font-size: var(--font-size-lg); }
    .total-amount { color: var(--color-secondary); font-weight: var(--font-weight-bold); }

    /* Shipping Info */
    .shipping-info { background: var(--color-bg-light); padding: var(--spacing-xl); border-radius: var(--radius-xl); margin-bottom: var(--spacing-lg); }
    .shipping-info h4 { font-family: var(--font-heading); margin-bottom: var(--spacing-lg); display: flex; align-items: center; gap: var(--spacing-sm); }
    .address-card p { color: var(--color-text-light); margin: 0; line-height: 1.6; }
    .address-card .name { font-weight: var(--font-weight-medium); color: var(--color-text); margin-bottom: var(--spacing-sm); }

    /* Order Timeline */
    .order-timeline { background: var(--color-bg-light); padding: var(--spacing-xl); border-radius: var(--radius-xl); margin-bottom: var(--spacing-lg); }
    .order-timeline h4 { font-family: var(--font-heading); margin-bottom: var(--spacing-lg); display: flex; align-items: center; gap: var(--spacing-sm); }
    .timeline { position: relative; padding-left: var(--spacing-lg); }
    .timeline::before { content: ''; position: absolute; left: 4px; top: 0; bottom: 0; width: 2px; background: var(--color-border); }
    .timeline-item { position: relative; padding-bottom: var(--spacing-lg); }
    .timeline-item:last-child { padding-bottom: 0; }
    .timeline-dot { position: absolute; left: -16px; top: 4px; width: 10px; height: 10px; border-radius: var(--radius-full); background: var(--color-secondary); }
    .timeline-dot.confirmed { background: #0dcaf0; }
    .timeline-dot.shipped { background: #198754; }
    .timeline-dot.delivered { background: #198754; }
    .timeline-content h5 { font-family: var(--font-heading); margin-bottom: var(--spacing-xs); }
    .timeline-content p { font-size: var(--font-size-sm); color: var(--color-text-muted); margin: 0; }

    /* Help Section */
    .help-section { text-align: center; padding: var(--spacing-2xl); background: var(--color-bg-light); border-radius: var(--radius-xl); margin-top: var(--spacing-xl); }
    .help-section h3 { font-family: var(--font-heading); margin-bottom: var(--spacing-sm); }
    .help-section p { color: var(--color-text-light); margin-bottom: var(--spacing-lg); }

    .spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: var(--spacing-sm); }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 576px) { .track-form-section { padding: var(--spacing-xl); } .status-header { flex-direction: column; text-align: center; } }
  `]
})
export class TrackOrderComponent implements OnInit {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  
  trackingInput = '';
  orderDetails: any = null;
  isLoading = false;
  errorMessage = '';

  statusSteps: OrderStatus[] = [
    { key: 'Pending', label: 'Order Placed', icon: 'fas fa-shopping-cart', description: 'Your order has been received' },
    { key: 'Confirmed', label: 'Order Confirmed', icon: 'fas fa-check-circle', description: 'Your order has been confirmed' },
    { key: 'Shipped', label: 'Shipped', icon: 'fas fa-truck', description: 'Your order is on its way' },
    { key: 'Delivered', label: 'Delivered', icon: 'fas fa-box-open', description: 'Your order has been delivered' }
  ];

  ngOnInit(): void {
    // Check if orderId is passed as query param
    this.route.queryParams.subscribe(params => {
      if (params['orderId']) {
        this.trackingInput = params['orderId'];
        this.trackOrder();
      }
    });
  }

  trackOrder(): void {
    if (!this.trackingInput.trim()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.trackOrder(this.trackingInput.trim()).subscribe({
      next: (response: OrderResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.orderDetails = response.data;
        } else {
          this.errorMessage = response.message || 'Order not found';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Unable to track order. Please check your order ID and try again.';
      }
    });
  }

  resetTracking(): void {
    this.orderDetails = null;
    this.trackingInput = '';
    this.errorMessage = '';
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

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusDescription(status: string): string {
    const descriptions: { [key: string]: string } = {
      'Pending': 'Your order has been received and is being processed.',
      'Confirmed': 'Your order has been confirmed and is being prepared for shipment.',
      'Shipped': 'Your package is on its way to the delivery address.',
      'Delivered': 'Your order has been successfully delivered.',
      'Cancelled': 'This order has been cancelled.'
    };
    return descriptions[status] || '';
  }

  getProgressPercentage(): number {
    const percentages: { [key: string]: number } = {
      'Pending': 25,
      'Confirmed': 50,
      'Shipped': 75,
      'Delivered': 100,
      'Cancelled': 0
    };
    return percentages[this.orderDetails?.orderStatus] || 0;
  }

  isStatusCompleted(status: string): boolean {
    const statusOrder = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
    const currentIndex = statusOrder.indexOf(this.orderDetails?.orderStatus);
    const checkIndex = statusOrder.indexOf(status);
    return currentIndex > checkIndex;
  }

  isCurrentStatus(status: string): boolean {
    return this.orderDetails?.orderStatus === status;
  }

  getStatusDate(status: string): Date | null {
    if (status === 'Pending' && this.orderDetails?.createdAt) {
      return new Date(this.orderDetails.createdAt);
    }
    if (status === this.orderDetails?.orderStatus && this.orderDetails?.updatedAt) {
      return new Date(this.orderDetails.updatedAt);
    }
    return null;
  }

  getEstimatedDelivery(): string {
    const orderDate = new Date(this.orderDetails?.createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    return deliveryDate.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}
