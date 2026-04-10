import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent],
  template: `
    <app-toast></app-toast>
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 200px);
      padding-top: 15px;
    }

    @media (max-width: 576px) {
      main {
        padding-top: 92px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Liya Creation';
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    // Handle Google OAuth token on any page
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      this.handleGoogleToken(token);
    }
  }

  private handleGoogleToken(token: string): void {
    // Store token in localStorage
    localStorage.setItem('token', token);
    
    // Decode JWT to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = {
        id: payload.id,
        email: payload.email,
        name: payload.name || 'Google User',
        role: payload.role || 'user',
        phone: ''
      };
      
      this.authService.setCurrentUser(user);
      
      // Clear URL parameters without reloading
      this.router.navigate([], {
        queryParams: {},
        queryParamsHandling: '',
        replaceUrl: true
      });
      
      console.log('Google user logged in:', user);
    } catch (e) {
      console.error('Error parsing JWT:', e);
    }
  }
}
