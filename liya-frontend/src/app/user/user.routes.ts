import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

export const USER_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.UserOrdersComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'order/:id',
    loadComponent: () => import('./pages/order-details/order-details.component').then(m => m.OrderDetailsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
