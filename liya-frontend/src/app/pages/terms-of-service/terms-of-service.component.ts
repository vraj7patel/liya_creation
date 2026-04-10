import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="policy-page">
      <div class="page-header">
        <div class="container">
          <h1>Terms of Service</h1>
          <p>Read our terms and conditions</p>
        </div>
      </div>

      <div class="container">
        <div class="policy-content">
          <section class="policy-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using Liya Creation website and services, you agree to be bound by these Terms of Service.</p>
          </section>

          <section class="policy-section">
            <h2>2. Use of Service</h2>
            <ul>
              <li>You must be 18 years or older to use our services</li>
              <li>You are responsible for maintaining confidentiality of your account</li>
              <li>You agree not to use our service for illegal purposes</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>3. Orders and Payments</h2>
            <ul>
              <li>All sales are final except as stated in our <a routerLink="/return-policy">Return Policy</a></li>
              <li>Prices are in Indian Rupees (INR) and include applicable taxes</li>
              <li>We reserve the right to refuse or cancel any order</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>4. Shipping and Delivery</h2>
            <p>Shipping times and charges are outlined in our <a routerLink="/shipping-policy">Shipping Policy</a>.</p>
          </section>

          <section class="policy-section">
            <h2>5. Returns and Refunds</h2>
            <p>Our <a routerLink="/return-policy">Return Policy</a> governs all returns and refunds.</p>
          </section>

          <section class="policy-section">
            <h2>6. Intellectual Property</h2>
            <p>All content, designs, and trademarks are property of Liya Creation. Unauthorized use is prohibited.</p>
          </section>

          <section class="policy-section">
            <h2>7. Limitation of Liability</h2>
            <p>We are not liable for indirect, incidental, or consequential damages arising from use of our service.</p>
          </section>

          <section class="policy-section">
            <h2>8. Account Termination</h2>
            <p>We reserve the right to suspend or terminate accounts for violation of these terms.</p>
          </section>

          <section class="policy-section">
            <h2>9. Governing Law</h2>
            <p>These terms are governed by the laws of India.</p>
          </section>

          <section class="policy-section">
            <h2>10. Changes to Terms</h2>
            <p>We may modify these terms. Continued use constitutes acceptance of changes.</p>
          </section>

          <section class="policy-section">
            <h2>11. Contact Information</h2>
            <p>For questions about these terms, contact us at <a href="mailto:support&#64;liyacreation.com">support&#64;liyacreation.com</a></p>
          </section>

          <div class="cta-section">
            <p>Questions about our terms? Get in touch!</p>
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
export class TermsOfServiceComponent {}
