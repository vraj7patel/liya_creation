import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="policy-page">
      <div class="page-header">
        <div class="container">
          <h1>Privacy Policy</h1>
          <p>Your privacy is important to us</p>
        </div>
      </div>

      <div class="container">
        <div class="policy-content">
          <section class="policy-section">
            <h2>1. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email, phone number, shipping address, payment details</li>
              <li><strong>Order Information:</strong> Products purchased, order history, delivery preferences</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, device information</li>
              <li><strong>Cookies:</strong> See our <a routerLink="/cookie-policy">Cookie Policy</a> for details</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>Process and fulfill orders</li>
              <li>Improve our website and services</li>
              <li>Send promotional emails and updates</li>
              <li>Prevent fraud and ensure security</li>
              <li>Personalize your shopping experience</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share it with:</p>
            <ul>
              <li>Shipping partners for delivery</li>
              <li>Payment processors for transactions</li>
              <li>Legal authorities when required</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>4. Data Security</h2>
            <p>We implement industry-standard security measures including SSL encryption, secure servers, and access controls to protect your information.</p>
          </section>

          <section class="policy-section">
            <h2>5. Your Rights</h2>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update inaccurate information</li>
              <li><strong>Deletion:</strong> Request removal of your data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>6. Cookies and Tracking</h2>
            <p>We use cookies to enhance your experience. Learn more in our <a routerLink="/cookie-policy">Cookie Policy</a>.</p>
          </section>

          <section class="policy-section">
            <h2>7. Children's Privacy</h2>
            <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children.</p>
          </section>

          <section class="policy-section">
            <h2>8. Changes to This Policy</h2>
            <p>We may update this policy. Significant changes will be notified via email or website notice.</p>
          </section>

          <section class="policy-section">
            <h2>9. Contact Us</h2>
            <p>For privacy concerns, contact us at <a href="mailto:privacy&#64;liyacreation.com">privacy&#64;liyacreation.com</a></p>
          </section>

          <div class="cta-section">
            <p>Have questions about your privacy? We're here to help!</p>
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
export class PrivacyPolicyComponent {}
