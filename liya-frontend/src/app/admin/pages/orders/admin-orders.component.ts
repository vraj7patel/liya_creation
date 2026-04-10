import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../../core/services/order.service';
import { NotificationService } from '../../../core/services/notification.service';

const STATUSES = ['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ao-page">

      <!-- Header -->
      <div class="ao-header">
        <div>
          <h1><i class="fas fa-clipboard-list"></i> Order Management</h1>
          <p>{{ filteredOrders.length }} order(s) found</p>
        </div>
        <button class="refresh-btn" (click)="load()" [disabled]="loading">
          <i class="fas fa-sync-alt" [class.spin]="loading"></i> Refresh
        </button>
      </div>

      <!-- Status Breakdown Bar -->
      <div class="status-bar">
        @for (s of statusBreakdown; track s._id; let i = $index) {
          <div class="sb-item" [class]="'sb-' + s._id.toLowerCase()">
            <span class="sb-count">{{ animBreakdown[i] }}</span>
            <span class="sb-label">{{ s._id }}</span>
          </div>
        }
      </div>

      <!-- Filters -->
      <div class="ao-filters">
        <div class="filter-tabs">
          @for (s of statuses; track s) {
            <button class="tab" [class.active]="activeFilter === s" (click)="setFilter(s)">
              {{ s === 'all' ? 'All' : s }}
              @if (s !== 'all') {
                <span class="tab-count">{{ getCount(s) }}</span>
              }
            </button>
          }
        </div>
        <input class="search-input" type="text" placeholder="Search by name, phone or order ID…"
          [(ngModel)]="searchTerm" (input)="applyFilter()" />
      </div>

      <!-- Table -->
      @if (loading) {
        <div class="ao-loading"><div class="spinner"></div><p>Loading orders…</p></div>
      } @else if (filteredOrders.length === 0) {
        <div class="ao-empty">
          <i class="fas fa-inbox"></i>
          <p>No orders found</p>
        </div>
      } @else {
        <div class="ao-table-wrap">
          <table class="ao-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              @for (order of filteredOrders; track order._id) {
                <tr [class.expanded]="expandedId === order._id">
                  <td class="oid">#{{ order._id.slice(-8).toUpperCase() }}</td>
                  <td>
                    <div class="cname">{{ order.shippingAddress.fullName }}</div>
                    <div class="cphone">{{ order.shippingAddress.phone }}</div>
                  </td>
                  <td><span class="items-pill">{{ order.products.length }} item(s)</span></td>
                  <td class="amount">₹{{ order.totalAmount | number:'1.0-0' }}</td>
                  <td>
                    <span class="pay-badge" [class.paid]="order.paymentStatus === 'Paid'">
                      {{ order.paymentStatus }}
                    </span>
                  </td>
                  <td class="date">{{ order.createdAt | date:'dd MMM yyyy' }}</td>
                  <td>
                    <select class="status-select" [class]="'sel-' + order.orderStatus.toLowerCase()"
                      [value]="order.orderStatus"
                      [disabled]="updatingId === order._id"
                      (change)="updateStatus(order, $event)">
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    @if (updatingId === order._id) {
                      <i class="fas fa-spinner fa-spin updating-icon"></i>
                    }
                  </td>
                  <td>
                    <button class="expand-btn" (click)="toggleExpand(order._id)"
                      [title]="expandedId === order._id ? 'Collapse' : 'View details'">
                      <i class="fas" [class.fa-chevron-down]="expandedId !== order._id"
                         [class.fa-chevron-up]="expandedId === order._id"></i>
                    </button>
                  </td>
                </tr>
                <!-- Expanded detail row -->
                @if (expandedId === order._id) {
                  <tr class="detail-row">
                    <td colspan="8">
                      <div class="detail-panel">
                        <div class="detail-cols">
                          <!-- Products -->
                          <div class="detail-section">
                            <h4><i class="fas fa-box"></i> Products</h4>
                            @for (p of order.products; track p.product) {
                              <div class="detail-product">
                                @if (p.image) {
                                  <img [src]="p.image" [alt]="p.name" class="dp-img" />
                                }
                                <div class="dp-info">
                                  <span class="dp-name">{{ p.name }}</span>
                                  <span class="dp-meta">Size: {{ p.size }} &nbsp;·&nbsp; Qty: {{ p.quantity }} &nbsp;·&nbsp; ₹{{ p.price | number:'1.0-0' }}</span>
                                </div>
                              </div>
                            }
                          </div>
                          <!-- Shipping -->
                          <div class="detail-section">
                            <h4><i class="fas fa-map-marker-alt"></i> Shipping Address</h4>
                            <p class="addr">
                              {{ order.shippingAddress.fullName }}<br>
                              {{ order.shippingAddress.address }}<br>
                              {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} – {{ order.shippingAddress.pincode }}<br>
                              <i class="fas fa-phone-alt"></i> {{ order.shippingAddress.phone }}
                            </p>
                          </div>
                          <!-- Summary -->
                          <div class="detail-section">
                            <h4><i class="fas fa-receipt"></i> Summary</h4>
                            <div class="summary-row"><span>Payment</span><span>{{ order.paymentMethod }}</span></div>
                            <div class="summary-row"><span>Payment Status</span>
                              <span [class.green]="order.paymentStatus === 'Paid'" [class.orange]="order.paymentStatus !== 'Paid'">
                                {{ order.paymentStatus }}
                              </span>
                            </div>
                            <div class="summary-row"><span>Order Total</span><strong>₹{{ order.totalAmount | number:'1.0-0' }}</strong></div>
                            <div class="summary-row"><span>Placed On</span><span>{{ order.createdAt | date:'medium' }}</span></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .ao-page { padding: 24px; background: #f8f9fa; min-height: 100vh; }

    /* Header */
    .ao-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    .ao-header h1 { font-size: 24px; font-weight: 700; color: #1a1a2e; margin: 0; display: flex; align-items: center; gap: 10px; }
    .ao-header h1 i { color: #8B0000; }
    .ao-header p { color: #6c757d; font-size: 13px; margin: 4px 0 0; }
    .refresh-btn { background: #8B0000; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .refresh-btn:hover:not(:disabled) { background: #6B0000; transform: translateY(-1px); }
    .refresh-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Status Breakdown Bar */
    .status-bar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .sb-item { flex: 1; min-width: 100px; padding: 14px 16px; border-radius: 12px; text-align: center; background: white; border: 1px solid #eee; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .sb-count { display: block; font-size: 22px; font-weight: 700; }
    .sb-label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; color: #6c757d; }
    .sb-pending   { border-top: 3px solid #ffc107; } .sb-pending .sb-count   { color: #856404; }
    .sb-confirmed { border-top: 3px solid #0d6efd; } .sb-confirmed .sb-count { color: #004085; }
    .sb-shipped   { border-top: 3px solid #17a2b8; } .sb-shipped .sb-count   { color: #0c5460; }
    .sb-delivered { border-top: 3px solid #28a745; } .sb-delivered .sb-count { color: #155724; }
    .sb-cancelled { border-top: 3px solid #dc3545; } .sb-cancelled .sb-count { color: #721c24; }

    /* Filters */
    .ao-filters { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
    .filter-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
    .tab { padding: 8px 16px; border: 1px solid #dee2e6; background: white; border-radius: 20px; font-size: 13px; cursor: pointer; transition: all 0.2s; color: #495057; display: flex; align-items: center; gap: 6px; }
    .tab:hover { border-color: #8B0000; color: #8B0000; }
    .tab.active { background: #8B0000; color: white; border-color: #8B0000; }
    .tab-count { background: rgba(255,255,255,0.25); padding: 1px 7px; border-radius: 10px; font-size: 11px; }
    .tab:not(.active) .tab-count { background: #f0f0f0; color: #6c757d; }
    .search-input { padding: 9px 16px; border: 1px solid #dee2e6; border-radius: 8px; font-size: 14px; width: 280px; outline: none; transition: border-color 0.2s; }
    .search-input:focus { border-color: #8B0000; box-shadow: 0 0 0 3px rgba(139,0,0,0.08); }

    /* Table */
    .ao-table-wrap { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; border: 1px solid #eee; overflow-x: auto; }
    .ao-table { width: 100%; border-collapse: collapse; }
    .ao-table th { padding: 14px 16px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6c757d; background: #f8f9fa; border-bottom: 1px solid #eee; }
    .ao-table td { padding: 14px 16px; border-bottom: 1px solid #f5f5f5; vertical-align: middle; font-size: 14px; }
    .ao-table tbody tr:hover { background: #fafafa; }
    .ao-table tbody tr.expanded { background: #fff8f8; }
    .ao-table tbody tr:last-child td { border-bottom: none; }

    .oid { font-family: monospace; font-weight: 600; color: #8B0000; font-size: 13px; }
    .cname { font-weight: 500; color: #1a1a2e; }
    .cphone { font-size: 12px; color: #6c757d; margin-top: 2px; }
    .items-pill { background: #f0f0f0; padding: 3px 10px; border-radius: 12px; font-size: 12px; color: #495057; }
    .amount { font-weight: 600; color: #1a1a2e; }
    .date { color: #6c757d; font-size: 13px; }
    .pay-badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; background: #fff3cd; color: #856404; }
    .pay-badge.paid { background: #d4edda; color: #155724; }

    /* Status Select */
    .status-select { padding: 6px 10px; border-radius: 8px; border: 1.5px solid #dee2e6; font-size: 13px; font-weight: 500; cursor: pointer; outline: none; transition: all 0.2s; background: white; }
    .status-select:focus { box-shadow: 0 0 0 3px rgba(139,0,0,0.1); }
    .sel-pending   { border-color: #ffc107; color: #856404; background: #fffdf0; }
    .sel-confirmed { border-color: #0d6efd; color: #004085; background: #f0f5ff; }
    .sel-shipped   { border-color: #17a2b8; color: #0c5460; background: #f0fafc; }
    .sel-delivered { border-color: #28a745; color: #155724; background: #f0fff4; }
    .sel-cancelled { border-color: #dc3545; color: #721c24; background: #fff5f5; }
    .updating-icon { margin-left: 8px; color: #8B0000; }

    /* Expand button */
    .expand-btn { background: #f8f9fa; border: 1px solid #dee2e6; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #6c757d; transition: all 0.2s; }
    .expand-btn:hover { background: #8B0000; color: white; border-color: #8B0000; }

    /* Detail row */
    .detail-row td { padding: 0; background: #fdf8f8; border-bottom: 2px solid #f0e0e0; }
    .detail-panel { padding: 20px 24px; }
    .detail-cols { display: grid; grid-template-columns: 2fr 1.5fr 1fr; gap: 24px; }
    .detail-section h4 { font-size: 13px; font-weight: 600; color: #8B0000; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px; display: flex; align-items: center; gap: 6px; }
    .detail-product { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f0e0e0; }
    .detail-product:last-child { border-bottom: none; }
    .dp-img { width: 44px; height: 44px; object-fit: cover; border-radius: 8px; border: 1px solid #eee; }
    .dp-info { display: flex; flex-direction: column; }
    .dp-name { font-size: 13px; font-weight: 500; color: #1a1a2e; }
    .dp-meta { font-size: 12px; color: #6c757d; margin-top: 2px; }
    .addr { font-size: 13px; color: #495057; line-height: 1.8; margin: 0; }
    .summary-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f5f5f5; font-size: 13px; color: #495057; }
    .summary-row:last-child { border-bottom: none; }
    .summary-row strong { color: #1a1a2e; }
    .green { color: #155724; font-weight: 500; }
    .orange { color: #856404; font-weight: 500; }

    /* Loading / Empty */
    .ao-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 16px; }
    .ao-loading .spinner { width: 40px; height: 40px; border: 3px solid #f0e0e0; border-top-color: #8B0000; border-radius: 50%; animation: spin 0.8s linear infinite; }
    .ao-loading p { color: #6c757d; margin: 0; }
    .ao-empty { text-align: center; padding: 60px; background: white; border-radius: 16px; border: 1px solid #eee; }
    .ao-empty i { font-size: 48px; color: #dee2e6; margin-bottom: 12px; }
    .ao-empty p { color: #6c757d; margin: 0; font-size: 15px; }

    @media (max-width: 992px) {
      .detail-cols { grid-template-columns: 1fr; }
      .search-input { width: 100%; }
      .ao-filters { flex-direction: column; align-items: stretch; }
    }
    @media (max-width: 576px) {
      .ao-page { padding: 16px; }
      .status-bar { gap: 8px; }
      .sb-item { min-width: 80px; padding: 10px 12px; }
    }
  `]
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private ns = inject(NotificationService);

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusBreakdown: { _id: string; count: number }[] = [];
  animBreakdown: number[] = [];
  statuses = STATUSES;
  activeFilter = 'all';
  searchTerm = '';
  loading = false;
  updatingId: string | null = null;
  expandedId: string | null = null;
  private timers: any[] = [];

  ngOnInit(): void { this.load(); }
  ngOnDestroy(): void { this.timers.forEach(t => clearInterval(t)); }

  private animateCount(target: number, setter: (v: number) => void): void {
    const steps = 40;
    const stepTime = 1200 / steps;
    let current = 0;
    const increment = target / steps;
    const t = setInterval(() => {
      current += increment;
      if (current >= target) { setter(Math.round(target)); clearInterval(t); }
      else { setter(Math.round(current)); }
    }, stepTime);
    this.timers.push(t);
  }

  load(): void {
    this.loading = true;
    this.orderService.getAdminOrders().subscribe({
      next: (res) => {
        this.orders = res.data || [];
        this.applyFilter();
        this.buildBreakdown();
        this.timers.forEach(t => clearInterval(t)); this.timers = [];
        this.animBreakdown = this.statusBreakdown.map(() => 0);
        this.statusBreakdown.forEach((s, i) =>
          this.animateCount(s.count, v => this.animBreakdown[i] = v)
        );
        this.loading = false;
      },
      error: () => { this.ns.error('Failed to load orders'); this.loading = false; }
    });
  }

  buildBreakdown(): void {
    const map = new Map<string, number>();
    for (const o of this.orders) {
      map.set(o.orderStatus, (map.get(o.orderStatus) || 0) + 1);
    }
    const order = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    this.statusBreakdown = order
      .filter(s => map.has(s))
      .map(s => ({ _id: s, count: map.get(s)! }));
  }

  setFilter(status: string): void {
    this.activeFilter = status;
    this.applyFilter();
  }

  applyFilter(): void {
    let list = this.activeFilter === 'all'
      ? this.orders
      : this.orders.filter(o => o.orderStatus === this.activeFilter);

    const q = this.searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter(o =>
        o.shippingAddress.fullName.toLowerCase().includes(q) ||
        o.shippingAddress.phone.includes(q) ||
        o._id.toLowerCase().includes(q)
      );
    }
    this.filteredOrders = list;
  }

  getCount(status: string): number {
    return this.orders.filter(o => o.orderStatus === status).length;
  }

  updateStatus(order: Order, event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value;
    if (newStatus === order.orderStatus) return;

    const prev = order.orderStatus;
    this.updatingId = order._id;
    order.orderStatus = newStatus;
    this.buildBreakdown();
    this.applyFilter();

    this.orderService.updateOrderStatus(order._id, newStatus).subscribe({
      next: () => {
        this.ns.success(`Order #${order._id.slice(-8).toUpperCase()} → ${newStatus}`);
        this.updatingId = null;
      },
      error: () => {
        order.orderStatus = prev;
        this.buildBreakdown();
        this.applyFilter();
        this.ns.error('Failed to update order status');
        this.updatingId = null;
      }
    });
  }

  toggleExpand(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }
}
