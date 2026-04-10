import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./products/pages/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'products/category/:category',
    loadComponent: () => import('./products/pages/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./products/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.routes').then(m => m.USER_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [AdminGuard]
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/pages/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./wishlist/pages/wishlist/wishlist.component').then(m => m.WishlistComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/pages/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  // New Pages
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'shipping-policy',
    loadComponent: () => import('./pages/shipping/shipping.component').then(m => m.ShippingComponent)
  },
  {
    path: 'return-policy',
    loadComponent: () => import('./pages/return/return.component').then(m => m.ReturnComponent)
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent)
  },
  {
    path: 'size-guide',
    loadComponent: () => import('./pages/size-guide/size-guide.component').then(m => m.SizeGuideComponent)
  },
  {
    path: 'track-order',
    loadComponent: () => import('./pages/track-order/track-order.component').then(m => m.TrackOrderComponent)
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
  },
  {
    path: 'terms-of-service',
    loadComponent: () => import('./pages/terms-of-service/terms-of-service.component').then(m => m.TermsOfServiceComponent)
  },
  {
    path: 'cookie-policy',
    loadComponent: () => import('./pages/cookie-policy/cookie-policy.component').then(m => m.CookiePolicyComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
