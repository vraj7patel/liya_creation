import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,70 1440,50 L1440,100 L0,100 Z"></path>
        </svg>
      </div>
      <div class="footer-content">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-section footer-brand">
              <div class="logo">
                <span class="logo-text">Liya</span>
                <span class="logo-sub">Creation</span>
              </div>
              <p>Your destination for exquisite women's ethnic wear. Quality, style, and tradition combined in every piece.</p>
              <div class="social-links">
                <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="#" aria-label="Pinterest"><i class="fab fa-pinterest-p"></i></a>
                <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
              </div>
            </div>

            <div class="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a routerLink="/">Home</a></li>
                <li><a routerLink="/products">All Products</a></li>
                <li><a routerLink="/products/category/Lehengas">Lehengas</a></li>
                <li><a routerLink="/products/category/saree">saree</a></li>
                <li><a routerLink="/products/category/Gowns">Gowns</a></li>
                <li><a routerLink="/products/category/Kurtis">Kurtis</a></li>
              </ul>
            </div>

            <div class="footer-section">
              <h4>Customer Service</h4>
              <ul>
                <li><a routerLink="/contact">Contact Us</a></li>
                <li><a routerLink="/shipping-policy">Shipping Policy</a></li>
                <li><a routerLink="/return-policy">Return Policy</a></li>
                <li><a routerLink="/faq">FAQ</a></li>
                <li><a routerLink="/size-guide">Size Guide</a></li>
                <li><a routerLink="/track-order">Track Order</a></li>
              </ul>
            </div>

            <div class="footer-section">
              <h4>Contact</h4>
              <ul class="contact-list">
                <li>
                  <i class="fas fa-phone-alt"></i>
                  <span>+91 1234567890</span>
                </li>
                <li>
                  <i class="fas fa-envelope"></i>
                  <span>info&#64;liyacreation.com</span>
                </li>
                <li>
                  <i class="fas fa-map-marker-alt"></i>
                  <span>Mumbai, Maharashtra, India</span>
                </li>
              </ul>
              <div class="newsletter">
                <h4>Newsletter</h4>
                <p>Subscribe for exclusive offers and updates</p>
                <form class="newsletter-form">
                  <input type="email" placeholder="Your email address">
                  <button type="submit"><i class="fas fa-arrow-right"></i></button>
                </form>
              </div>
            </div>
          </div>

          <div class="footer-bottom">
            <div class="footer-bottom-content">
              <p>&copy; 2026 Liya Creation. All rights reserved.</p>
              <div class="footer-bottom-links">
                <a routerLink="/privacy-policy">Privacy Policy</a>
                <a routerLink="/terms-of-service">Terms of Service</a>
                <a routerLink="/cookie-policy">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      position: relative;
      color: var(--color-text-inverse);
      margin-top: var(--spacing-4xl);
    }

    .footer-wave {
      color: var(--color-forest);
      height: 100px;
      overflow: hidden;
      
      svg {
        display: block;
        width: 100%;
        height: 100px;
      }
    }

    .footer-content {
      background: linear-gradient(135deg, var(--color-forest) 0%, #0f2922 100%);
      padding: var(--spacing-3xl) 0 var(--spacing-xl);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
      gap: var(--spacing-2xl);
    }

    .footer-section {
      h4 {
        font-family: var(--font-heading);
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        color: var(--color-secondary);
        text-transform: uppercase;
        letter-spacing: var(--letter-spacing-wider);
        margin-bottom: var(--spacing-lg);
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: var(--spacing-md);
          
          a {
            color: rgba(255, 255, 255, 0.8);
            font-size: var(--font-size-sm);
            text-decoration: none;
            transition: all var(--transition-smooth);
            display: inline-block;
            position: relative;

            &::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 0;
              height: 1px;
              background: var(--color-secondary);
              transition: width var(--transition-smooth);
            }

            &:hover {
              color: var(--color-secondary);
              
              &::after {
                width: 100%;
              }
            }
          }
        }
      }

      &.footer-brand {
        .logo {
          display: flex;
          flex-direction: column;
          margin-bottom: var(--spacing-lg);
          
          .logo-text {
            font-family: var(--font-heading);
            font-size: 2rem;
            font-weight: var(--font-weight-bold);
            color: var(--color-secondary);
            line-height: 1.2;
          }

          .logo-sub {
            font-family: var(--font-body);
            font-size: 0.65rem;
            color: rgba(255, 255, 255, 0.6);
            letter-spacing: 0.3em;
            text-transform: uppercase;
          }
        }

        p {
          color: rgba(255, 255, 255, 0.7);
          font-size: var(--font-size-sm);
          line-height: 1.8;
          margin-bottom: var(--spacing-lg);
        }
      }
    }

    .social-links {
      display: flex;
      gap: var(--spacing-md);

      a {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-inverse);
        transition: all var(--transition-smooth);
        text-decoration: none;

        &:hover {
          background: var(--color-secondary);
          border-color: var(--color-secondary);
          transform: translateY(-4px);
          box-shadow: var(--shadow-glow);
        }
      }
    }

    .contact-list {
      li {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-md);
        
        i {
          color: var(--color-secondary);
          margin-top: 4px;
        }
        
        span {
          color: rgba(255, 255, 255, 0.8);
          font-size: var(--font-size-sm);
        }
      }
    }

    .newsletter {
      margin-top: var(--spacing-xl);
      
      h4 {
        margin-bottom: var(--spacing-sm);
      }
      
      p {
        color: rgba(255, 255, 255, 0.6);
        font-size: var(--font-size-xs);
        margin-bottom: var(--spacing-md);
      }
    }

    .newsletter-form {
      display: flex;
      gap: var(--spacing-sm);
      
      input {
        flex: 1;
        padding: var(--spacing-md);
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: var(--radius-md);
        color: var(--color-text-inverse);
        font-size: var(--font-size-sm);
        
        &::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        &:focus {
          outline: none;
          border-color: var(--color-secondary);
        }
      }
      
      button {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
        border: none;
        border-radius: var(--radius-md);
        color: var(--color-text-inverse);
        cursor: pointer;
        transition: all var(--transition-smooth);
        
        &:hover {
          transform: scale(1.05);
          box-shadow: var(--shadow-glow);
        }
      }
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: var(--spacing-2xl);
      padding-top: var(--spacing-xl);
    }

    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      p {
        color: rgba(255, 255, 255, 0.6);
        font-size: var(--font-size-sm);
        margin: 0;
      }
    }

    .footer-bottom-links {
      display: flex;
      gap: var(--spacing-xl);
      
      a {
        color: rgba(255, 255, 255, 0.6);
        font-size: var(--font-size-sm);
        text-decoration: none;
        transition: color var(--transition-fast);
        
        &:hover {
          color: var(--color-secondary);
        }
      }
    }

    /* Responsive */
    @media (max-width: 992px) {
      .footer-grid { grid-template-columns: repeat(2, 1fr); }
      .footer-section.footer-brand { grid-column: span 2; }
    }
    @media (max-width: 576px) {
      .footer-grid { grid-template-columns: 1fr; }
      .footer-section.footer-brand { grid-column: span 1; }
      .footer-bottom-content { flex-direction: column; gap: var(--spacing-md); text-align: center; }
      .footer-bottom-links { flex-wrap: wrap; justify-content: center; gap: var(--spacing-md); }
      .newsletter-form { flex-direction: column; }
      .newsletter-form input { width: 100%; }
      .newsletter-form button { width: 100%; height: 44px; }
      .footer-content { padding: var(--spacing-2xl) 0 var(--spacing-lg); }
    }
  `]
})
export class FooterComponent {}
