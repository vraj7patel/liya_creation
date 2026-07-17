import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../../core/services/product.service';
import { OrderService, Order } from '../../../core/services/order.service';
import { NotificationService } from '../../../core/services/notification.service';
import { forkJoin } from 'rxjs';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  categoryBreakdown: CategoryBreakdown[];
  orderStatusBreakdown: OrderStatusBreakdown[];
  lowStockProducts: LowStockProduct[];
}

interface CategoryBreakdown {
  _id: string;
  count: number;
  totalStock: number;
}

interface OrderStatusBreakdown {
  _id: string;
  count: number;
}

interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
  category: string;
  images?: string[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgClass, RouterLink],
  template: `
    <div class="admin-dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1><i class="fas fa-cog"></i> Admin Dashboard</h1>
          <p class="subtitle">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div class="header-actions">
          <span class="last-updated">
            <i class="fas fa-clock"></i> Last updated: {{ lastUpdated | date:'shortTime' }}
          </span>
          <button class="refresh-btn" (click)="refreshData()" [disabled]="loading">
            <i class="fas fa-sync-alt" [class.spin]="loading"></i>
            Refresh
          </button>
        </div>
      </div>

      @if (loading) {
        <div class="loading-overlay">
          <div class="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      }

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card users-card">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ animTotalUsers }}</div>
            <div class="stat-label">Total Users</div>
            <div class="stat-trend positive">
              <i class="fas fa-arrow-up"></i> Active
            </div>
          </div>
        </div>

        <div class="stat-card products-card">
          <div class="stat-icon">
            <i class="fas fa-box-open"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ animTotalProducts }}</div>
            <div class="stat-label">Total Products</div>
            <div class="stat-trend">
              <i class="fas fa-layer-group"></i> In Stock
            </div>
          </div>
        </div>

        <div class="stat-card orders-card sb-item" [class.sb-pending]="getPendingOrders() > 0">
          <div class="stat-icon">
            <i class="fas fa-shopping-bag"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ animTotalOrders }}</div>
            <div class="stat-label">Total Orders</div>
            <div class="stat-trend positive">
              <i class="fas fa-arrow-up"></i> {{ getPendingOrders() }} pending
            </div>
          </div>
        </div>

        <div class="stat-card revenue-card">
          <div class="stat-icon">
            <i class="fas fa-rupee-sign"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">₹{{ animRevenue | number:'1.0-0' }}</div>
            <div class="stat-label">Total Revenue</div>
            <div class="stat-trend positive">
              <i class="fas fa-chart-line"></i> All time
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Section -->
      <div class="middle-section">
        <!-- Order Status Breakdown -->
        <div class="card order-status-card">
          <div class="card-header">
            <h2><i class="fas fa-chart-pie"></i> Order Status</h2>
          </div>
          <div class="card-body">
            <div class="status-grid">
              @for (status of stats.orderStatusBreakdown; track status._id; let i = $index) {
                <div class="status-item" [ngClass]="getStatusClass(status._id)">
                  <div class="status-count">{{ animStatusCounts[i] }}</div>
                  <div class="status-label">{{ status._id }}</div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="card category-card">
          <div class="card-header">
            <h2><i class="fas fa-tags"></i> Products by Category</h2>
          </div>
          <div class="card-body">
            @if (stats.categoryBreakdown.length > 0) {
              <div class="category-list">
                @for (cat of stats.categoryBreakdown; track cat._id) {
                  <div class="category-item">
                    <div class="category-info">
                      <span class="category-name">{{ cat._id }}</span>
                      <span class="category-count">{{ cat.count }} products</span>
                    </div>
                    <div class="category-stock">
                      <span class="stock-badge" [class.low]="cat.totalStock < 10">
                        {{ cat.totalStock }} in stock
                      </span>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="no-data">No categories found</p>
            }
          </div>
        </div>

        <!-- Low Stock Alert -->
        <div class="card low-stock-card">
          <div class="card-header">
            <h2><i class="fas fa-exclamation-triangle"></i> Low Stock Alert</h2>
            @if (stats.lowStockProducts.length > 0) {
              <span class="alert-badge">{{ stats.lowStockProducts.length }}</span>
            }
          </div>
          <div class="card-body">
            @if (stats.lowStockProducts.length > 0) {
              <div class="low-stock-list">
                @for (product of stats.lowStockProducts.slice(0, 5); track product._id) {
                  <div class="low-stock-item" [class.critical]="product.stock === 0" [class.warning]="product.stock > 0 && product.stock <= 3">
                    <div class="product-info">
                      <span class="product-name">{{ product.name }}</span>
                      <span class="product-category">{{ product.category }}</span>
                    </div>
                    <div class="stock-warning" [class.out]="product.stock === 0">
                      @if (product.stock === 0) {
                        <i class="fas fa-times-circle"></i> Out of stock
                      } @else {
                        <i class="fas fa-exclamation-circle"></i> {{ product.stock }} left
                      }
                    </div>
                  </div>
                }
              </div>
              @if (stats.lowStockProducts.length > 5) {
                <a routerLink="/admin/products" class="view-all-link">
                  View all {{ stats.lowStockProducts.length }} products
                  <i class="fas fa-arrow-right"></i>
                </a>
              }
            } @else {
              <div class="no-alerts">
                <i class="fas fa-check-circle"></i>
                <p>All products are well stocked!</p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h2><i class="fas fa-bolt"></i> Quick Actions</h2>
        <div class="action-grid">
          <a routerLink="/admin/products/add" class="action-card">
            <div class="action-icon">
              <i class="fas fa-plus-circle"></i>
            </div>
            <div class="action-content">
              <h3>Add Product</h3>
              <p>Create a new product listing</p>
            </div>
            <i class="fas fa-chevron-right arrow"></i>
          </a>

          <a routerLink="/admin/orders" class="action-card">
            <div class="action-icon">
              <i class="fas fa-clipboard-list"></i>
            </div>
            <div class="action-content">
              <h3>Manage Orders</h3>
              <p>View and process orders</p>
            </div>
            <i class="fas fa-chevron-right arrow"></i>
          </a>

          <a routerLink="/admin/users" class="action-card">
            <div class="action-icon">
              <i class="fas fa-user-cog"></i>
            </div>
            <div class="action-content">
              <h3>Manage Users</h3>
              <p>User accounts & permissions</p>
            </div>
            <i class="fas fa-chevron-right arrow"></i>
          </a>

          <a routerLink="/admin/products" class="action-card">
            <div class="action-icon">
              <i class="fas fa-boxes"></i>
            </div>
            <div class="action-content">
              <h3>All Products</h3>
              <p>View product inventory</p>
            </div>
            <i class="fas fa-chevron-right arrow"></i>
          </a>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="recent-orders-section">
        <div class="section-header">
          <h2><i class="fas fa-shopping-cart"></i> Recent Orders</h2>
          <a routerLink="/admin/orders" class="view-all-btn">
            View All <i class="fas fa-arrow-right"></i>
          </a>
        </div>
        
        @if (recentOrders.length > 0) {
          <div class="orders-table-wrapper">
            <table class="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (order of recentOrders.slice(0, 8); track order._id) {
                  <tr>
                    <td class="order-id">#{{ order._id.slice(-8) }}</td>
                    <td class="customer-info">
                      <div class="customer-name">{{ order.shippingAddress.fullName }}</div>
                      <div class="customer-phone">{{ order.shippingAddress.phone }}</div>
                    </td>
                    <td>
                      <span class="items-count">{{ order.products.length }} item(s)</span>
                    </td>
                    <td class="order-total">₹{{ order.totalAmount | number:'1.0-0' }}</td>
                    <td>
                      <span class="status-badge" [ngClass]="getStatusClass(order.orderStatus)">
                        {{ order.orderStatus }}
                      </span>
                    </td>
                    <td class="order-date">{{ order.createdAt | date:'mediumDate' }}</td>
                    <td>
                      <button class="view-btn" routerLink="/admin/orders">
                        <i class="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="no-orders">
            <i class="fas fa-shopping-basket"></i>
            <p>No orders yet</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 24px;
      background: #f8f9fa;
      min-height: 100vh;
    }

    /* Header Styles */
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;

      .header-content {
        h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;

          i {
            color: #e94560;
          }
        }

        .subtitle {
          color: #6c757d;
          margin: 4px 0 0 0;
          font-size: 14px;
        }
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;

        .last-updated {
          font-size: 13px;
          color: #6c757d;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .refresh-btn {
          background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(233, 69, 96, 0.3);

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(233, 69, 96, 0.4);
          }

          &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .spin {
            animation: spin 1s linear infinite;
          }
        }
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Loading Overlay */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1000;

      .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #e94560;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      p {
        margin-top: 16px;
        color: #6c757d;
        font-weight: 500;
      }
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 32px;
    }

      .stat-card {
        background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      border: 1px solid #eee;

       &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      }

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
      }

      &.users-card .stat-icon {
        background: linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%);
      }

      &.products-card .stat-icon {
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      }

      &.orders-card .stat-icon {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.revenue-card .stat-icon {
        background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
      }

      .stat-content {
        flex: 1;

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a2e;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 4px;
        }

        .stat-trend {
          font-size: 12px;
          color: #6c757d;
          display: flex;
          align-items: center;
          gap: 4px;

          &.positive {
            color: #28a745;
          }

          &.negative {
            color: #dc3545;
          }
        }
      }
    }

    /* Middle Section */
    .middle-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 32px;
    }

    .card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      border: 1px solid #eee;
      overflow: hidden;

      .card-header {
        padding: 20px 24px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        h2 {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a2e;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;

          i {
            color: #e94560;
          }
        }

        .alert-badge {
          background: #dc3545;
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
      }

      .card-body {
        padding: 20px 24px;
      }
    }

    /* Order Status */
    .status-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .status-item {
      padding: 16px;
      border-radius: 12px;
      text-align: center;
      background: #f8f9fa;

      .status-count {
        font-size: 24px;
        font-weight: 700;
        color: #1a1a2e;
      }

      .status-label {
        font-size: 12px;
        color: #6c757d;
        text-transform: capitalize;
        margin-top: 4px;
      }

      &.pending {
        background: #fff3cd;
        .status-count { color: #856404; }
      }

      &.confirmed {
        background: #cce5ff;
        .status-count { color: #004085; }
      }

      &.shipped {
        background: #d1ecf1;
        .status-count { color: #0c5460; }
      }

      &.delivered {
        background: #d4edda;
        .status-count { color: #155724; }
      }

      &.cancelled {
        background: #f8d7da;
        .status-count { color: #721c24; }
      }
    }

    /* Category List */
    .category-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 10px;

      .category-info {
        display: flex;
        flex-direction: column;

        .category-name {
          font-weight: 600;
          color: #1a1a2e;
          font-size: 14px;
        }

        .category-count {
          font-size: 12px;
          color: #6c757d;
        }
      }

      .stock-badge {
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 20px;
        background: #d4edda;
        color: #155724;

        &.low {
          background: #f8d7da;
          color: #721c24;
        }
      }
    }

    /* Low Stock */
    .low-stock-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .low-stock-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #fff3cd;
      border-radius: 10px;
      border-left: 4px solid #ffc107;

      &.critical {
        background: #f8d7da;
        border-left-color: #dc3545;
      }

      &.warning {
        background: #ffe8cc;
        border-left-color: #fd7e14;
      }

      .product-info {
        display: flex;
        flex-direction: column;

        .product-name {
          font-weight: 600;
          color: #1a1a2e;
          font-size: 14px;
        }

        .product-category {
          font-size: 12px;
          color: #6c757d;
        }
      }

      .stock-warning {
        color: #dc3545;
        font-weight: 600;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 4px;

        &.out {
          color: #721c24;
          font-weight: 700;
        }
      }
    }

    .view-all-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 12px;
      padding: 10px;
      color: #e94560;
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      border-radius: 8px;
      background: #fff5f5;
      transition: all 0.3s ease;

      &:hover {
        background: #ffe0e0;
      }
    }

    .no-alerts {
      text-align: center;
      padding: 24px;
      color: #28a745;

      i {
        font-size: 36px;
        margin-bottom: 8px;
      }

      p {
        margin: 0;
        font-weight: 500;
      }
    }

    .no-data {
      text-align: center;
      color: #6c757d;
      font-size: 14px;
      padding: 20px;
    }

    /* Quick Actions */
    .quick-actions-section {
      margin-bottom: 32px;

      h2 {
        font-size: 20px;
        font-weight: 600;
        color: #1a1a2e;
        margin: 0 0 20px 0;
        display: flex;
        align-items: center;
        gap: 10px;

        i {
          color: #e94560;
        }
      }
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .action-card {
      background: white;
      border-radius: 14px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      text-decoration: none;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      border: 1px solid #eee;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        border-color: #e94560;

        .arrow {
          transform: translateX(4px);
          color: #e94560;
        }
      }

      .action-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        background: linear-gradient(135deg, #fff0f0 0%, #ffe0e0 100%);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 22px;
          color: #e94560;
        }
      }

      .action-content {
        flex: 1;

        h3 {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a2e;
          margin: 0 0 4px 0;
        }

        p {
          font-size: 12px;
          color: #6c757d;
          margin: 0;
        }
      }

      .arrow {
        color: #adb5bd;
        font-size: 14px;
        transition: all 0.3s ease;
      }
    }

    /* Recent Orders */
    .recent-orders-section {
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      border: 1px solid #eee;
      overflow: hidden;

      .section-header {
        padding: 20px 24px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        h2 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a2e;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;

          i {
            color: #e94560;
          }
        }

        .view-all-btn {
          color: #e94560;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.3s ease;

          &:hover {
            gap: 10px;
          }
        }
      }
    }

    .orders-table-wrapper {
      overflow-x: auto;
    }

    .orders-table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 16px 20px;
        text-align: left;
        border-bottom: 1px solid #f0f0f0;
      }

      th {
        font-weight: 600;
        color: #6c757d;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: #f8f9fa;
      }

      tbody tr {
        transition: background 0.2s ease;

        &:hover {
          background: #fafafa;
        }

        &:last-child td {
          border-bottom: none;
        }
      }

      .order-id {
        font-weight: 600;
        color: #e94560;
        font-family: monospace;
      }

      .customer-info {
        .customer-name {
          font-weight: 500;
          color: #1a1a2e;
        }

        .customer-phone {
          font-size: 12px;
          color: #6c757d;
        }
      }

      .items-count {
        font-size: 13px;
        color: #6c757d;
      }

      .order-total {
        font-weight: 600;
        color: #1a1a2e;
      }

      .order-date {
        color: #6c757d;
        font-size: 13px;
      }

      .status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        text-transform: capitalize;

        &.pending { background: #fff3cd; color: #856404; }
        &.confirmed { background: #cce5ff; color: #004085; }
        &.shipped { background: #d1ecf1; color: #0c5460; }
        &.delivered { background: #d4edda; color: #155724; }
        &.cancelled { background: #f8d7da; color: #721c24; }
      }

      .view-btn {
        background: #f8f9fa;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6c757d;
        transition: all 0.3s ease;

        &:hover {
          background: #e94560;
          color: white;
        }
      }
    }

    .no-orders {
      text-align: center;
      padding: 48px;
      color: #6c757d;

      i {
        font-size: 48px;
        margin-bottom: 12px;
        opacity: 0.5;
      }

      p {
        margin: 0;
        font-weight: 500;
      }
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .middle-section {
        grid-template-columns: 1fr;
      }

      .action-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .admin-dashboard {
        padding: 16px;
      }

      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;

        .header-actions {
          width: 100%;
          justify-content: space-between;
        }
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }

      .stat-card {
        padding: 16px;
        gap: 12px;
        .stat-icon { width: 48px; height: 48px; font-size: 20px; }
        .stat-content .stat-value { font-size: 22px; }
      }

      .action-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .orders-table {
        th, td {
          padding: 12px;
        }
      }
    }

    @media (max-width: 480px) {
      .admin-dashboard { padding: 12px; }
      .stats-grid { grid-template-columns: 1fr; gap: 12px; }
      .action-grid { grid-template-columns: 1fr; }
      .stat-card { padding: 14px; }
      .dashboard-header .header-content h1 { font-size: 20px; }
      .last-updated { display: none !important; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private ns = inject(NotificationService);

  stats: DashboardStats = {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    categoryBreakdown: [],
    orderStatusBreakdown: [],
    lowStockProducts: []
  };

  // animated display values
  animTotalUsers = 0;
  animTotalProducts = 0;
  animTotalOrders = 0;
  animRevenue = 0;
  animStatusCounts: number[] = [];

  recentOrders: Order[] = [];
  loading = true;
  lastUpdated = new Date();
  private timers: any[] = [];

  ngOnInit(): void { this.loadDashboardData(); }
  ngOnDestroy(): void { this.timers.forEach(t => clearInterval(t)); }

  private animateCount(target: number, duration: number, setter: (v: number) => void): void {
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;
    const increment = target / steps;
    const t = setInterval(() => {
      current += increment;
      if (current >= target) { setter(Math.round(target)); clearInterval(t); }
      else { setter(Math.round(current)); }
    }, stepTime);
    this.timers.push(t);
  }

  private readonly STATUS_ORDER = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  buildStatusBreakdown(orders: Order[]): OrderStatusBreakdown[] {
    const map = new Map<string, number>();
    for (const o of orders) {
      map.set(o.orderStatus, (map.get(o.orderStatus) || 0) + 1);
    }
    return this.STATUS_ORDER.map(s => ({ _id: s, count: map.get(s) || 0 }));
  }

  loadDashboardData(): void {
    this.loading = true;

    forkJoin({
      stats: this.productService.getStats(),
      orderStats: this.orderService.getOrderStats(),
      allOrders: this.orderService.getAdminOrders(),
      lowStock: this.productService.getLowStockProducts(5)
    }).subscribe({
      next: ({ stats, orderStats, allOrders, lowStock }) => {
        const orders = allOrders.data || [];
        this.stats = {
          totalUsers: stats.data.totalUsers,
          totalProducts: stats.data.totalProducts,
          totalOrders: orderStats.data.totalOrders,
          revenue: orderStats.data.revenue,
          categoryBreakdown: stats.data.categoryBreakdown || [],
          orderStatusBreakdown: this.buildStatusBreakdown(orders),
          lowStockProducts: lowStock.data || []
        };
        this.recentOrders = orderStats.data.recentOrders || [];
        this.lastUpdated = new Date();
        this.loading = false;
        // trigger animations
        this.timers.forEach(t => clearInterval(t)); this.timers = [];
        this.animateCount(this.stats.totalUsers, 1200, v => this.animTotalUsers = v);
        this.animateCount(this.stats.totalProducts, 1200, v => this.animTotalProducts = v);
        this.animateCount(this.stats.totalOrders, 1200, v => this.animTotalOrders = v);
        this.animateCount(this.stats.revenue, 1500, v => this.animRevenue = v);
        this.animStatusCounts = this.stats.orderStatusBreakdown.map(() => 0);
        this.stats.orderStatusBreakdown.forEach((s, i) =>
          this.animateCount(s.count, 1200, v => this.animStatusCounts[i] = v)
        );
      },
      error: () => {
        this.ns.error('Failed to load dashboard data');
        this.loading = false;
      }
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  getPendingOrders(): number {
    const pending = this.stats.orderStatusBreakdown.find(s => s._id?.toLowerCase() === 'pending');
    return pending?.count || 0;
  }

  getStatusClass(status: string): string {
    if (!status) return 'pending';
    return status.toLowerCase();
  }
}
