import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  template: `<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;color:#666">Signing you in...</div>`
})
export class GoogleCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  ngOnInit(): void {
    const userParam = this.route.snapshot.queryParams['user'];
    if (userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        this.authService.setCurrentUser(user);
        this.cartService.loadCart();
        this.wishlistService.loadWishlist();
        this.router.navigate([user.role === 'admin' ? '/admin/dashboard' : '/']);
      } catch {
        this.router.navigate(['/auth/login'], { queryParams: { error: 'google_failed' } });
      }
    } else {
      this.router.navigate(['/auth/login'], { queryParams: { error: 'google_failed' } });
    }
  }
}
