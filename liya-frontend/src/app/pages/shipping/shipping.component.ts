import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="policy-page">
      <div class="page-header">
        <div class="container">
          <h1>Shipping Policy</h1>
          <p>Everything you need to know about our shipping</p>
        </div>
      </div>

      <div class="container">
        <div class="policy-content">
          <section class="policy-section">
            <h2>Shipping Methods</h2>
            <p>We offer the following shipping methods:</p>
            <ul>
              <li><strong>Standard Shipping:</strong> 5-7 business days (Free for orders above ₹1,999)</li>
              <li><strong>Express Shipping:</strong> 2-3 business days (₹299)</li>
              <li><strong>Next Day Delivery:</strong> Order before 12 PM (₹499)</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>Shipping Charges</h2>
            <ul>
              <li>Orders below ₹1,999: Shipping charge of ₹149</li>
              <li>Orders above ₹1,999: FREE shipping</li>
              <li>Express delivery: Additional ₹299</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>Delivery Areas</h2>
            <p>We deliver across India. For international shipping, please contact us at <a href="mailto:info&#64;liyacreation.com">info&#64;liyacreation.com</a></p>
          </section>

          <section class="policy-section">
            <h2>Order Processing Time</h2>
            <ul>
              <li>Orders are processed within 24-48 hours</li>
              <li>Customized/stitched items may take 3-5 additional days</li>
              <li>Orders placed on weekends and holidays will be processed on the next business day</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>Tracking Your Order</h2>
            <p>Once your order is shipped, you will receive a tracking number via SMS and email. You can track your order using:</p>
            <ul>
              <li>The tracking link in your email</li>
              <li>Our website's <a routerLink="/track-order">Track Order</a> page</li>
              <li>Contact our customer support</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>Shipping Address</h2>
            <p>Please ensure your shipping address is correct at the time of ordering. We are not responsible for delivery delays due to incorrect addresses.</p>
          </section>

          <div class="cta-section">
            <p>Have questions? We're here to help!</p>
            <a routerLink="/contact" class="btn btn-primary">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .policy-page {
      min-height: 100vh;
      background: var(--color-bg);
    }

    .page-header {
      background: linear-gradient(135deg, var(--color-forest) 0%, #0f2922 100%);
      padding: var(--spacing-3xl) 0;
      margin-bottom: var(--spacing-3xl);
    }

    .page-header h1 {
      font-family: var(--font-heading);
      font-size: var(--font-size-4xl);
      color: white;
      margin-bottom: var(--spacing-sm);
    }

    .page-header p {
      font-size: var(--font-size-base);
      color: rgba(255, 255, 255, 0.7);
    }

    .policy-content {
      max-width: 800px;
      margin: 0 auto;
      padding-bottom: var(--spacing-4xl);
    }

    .policy-section {
      background: var(--color-bg-light);
      padding: var(--spacing-xl);
      border-radius: var(--radius-xl);
      margin-bottom: var(--spacing-lg);
    }

    .policy-section h2 {
      font-family: var(--font-heading);
      font-size: var(--font-size-xl);
      margin-bottom: var(--spacing-lg);
      color: var(--color-text);
    }

    .policy-section p {
      color: var(--color-text-light);
      line-height: 1.8;
      margin-bottom: var(--spacing-md);
    }

    .policy-section ul {
      list-style: none;
      padding: 0;
    }

    .policy-section ul li {
      padding: var(--spacing-sm) 0;
      color: var(--color-text-light);
      border-bottom: 1px solid var(--color-border-light);
    }

    .policy-section ul li:last-child {
      border-bottom: none;
    }

    .policy-section a {
      color: var(--color-secondary);
      text-decoration: none;
    }

    .policy-section a:hover {
      text-decoration: underline;
    }

    .cta-section {
      text-align: center;
      padding: var(--spacing-2xl);
      background: var(--color-bg-light);
      border-radius: var(--radius-xl);
      margin-top: var(--spacing-xl);
    }

    .cta-section p {
      margin-bottom: var(--spacing-lg);
      color: var(--color-text-light);
    }
  `]
})
export class ShippingComponent {}
