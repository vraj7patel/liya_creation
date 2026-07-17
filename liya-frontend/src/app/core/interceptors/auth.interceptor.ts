import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const skipAuthUrls = ['/auth/login', '/auth/register'];
  const shouldSkipAuth = skipAuthUrls.some(url => req.url.includes(url));

  // Add x-user-id header for cross-origin session fallback
  const user = authService.currentUser();
  const headers: Record<string, string> = {};
  if (user?.id) headers['x-user-id'] = user.id;

  const modifiedReq = req.clone({
    withCredentials: true,
    setHeaders: headers
  });

  // For non-auth endpoints, check if user is authenticated
  if (!shouldSkipAuth) {
    return next(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Only redirect to login if it's a 401 and not already on login page
        if (error.status === 401 && !req.url.includes('/auth/me')) {
          authService.currentUser.set(null);
          localStorage.removeItem('user');
          
          // Only navigate if not already on login page
          if (!window.location.pathname.includes('/auth/login')) {
            router.navigate(['/auth/login']);
          }
        }
        return throwError(() => error);
      })
    );
  }

  return next(modifiedReq);
};
