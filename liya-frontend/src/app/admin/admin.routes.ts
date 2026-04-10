import { Routes } from '@angular/router';
import { AdminGuard } from '../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/admin-products.component').then(m => m.AdminProductsComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'products/new',
    loadComponent: () => import('./pages/products/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/products/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/admin-orders.component').then(m => m.AdminOrdersComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/admin-users.component').then(m => m.AdminUsersComponent),
    canActivate: [AdminGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
