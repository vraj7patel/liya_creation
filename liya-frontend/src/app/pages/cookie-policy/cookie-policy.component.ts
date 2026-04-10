import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="policy-page">
      <div class="page-header">
        <div class="container">
          <h1>Cookie Policy</h1>
          <p>Understanding our use of cookies</p>
        </div>
      </div>

      <div class="container">
        <div class="policy-content">
          <section class="policy-section">
            <h2>1. What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit our website. They help us remember your preferences and provide better services.</p>
          </section>

          <section class="policy-section">
            <h2>2. Types of Cookies We Use</h2>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
              <li><strong>Performance Cookies:</strong> Analyze website performance and usage</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Targeting Cookies:</strong> Deliver personalized ads and content</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>3. Cookie Details</h2>
            <table class="cookie-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>_session</td>
                  <td>Shopping cart functionality</td>
                  <td>Session</td>
                  <td>Essential</td>
                </tr>
                <tr>
                  <td>_auth</td>
                  <td>User authentication</td>
                  <td>30 days</td>
                  <td>Essential</td>
                </tr>
                <tr>
                  <td>_analytics</td>
                  <td>Website analytics</td>
                  <td>1 year</td>
                  <td>Performance</td>
                </tr>
                <tr>
                  <td>_preferences</td>
                  <td>User preferences</td>
                  <td>90 days</td>
                  <td>Functional</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="policy-section">
            <h2>4. Third-Party Cookies</h2>
            <p>We use third-party services that may set their own cookies:</p>
            <ul>
              <li>Google Analytics (performance tracking)</li>
              <li>Payment gateways (secure transactions)</li>
              <li>Social media plugins (sharing functionality)</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>5. Managing Cookies</h2>
            <ul>
              <li>Browser settings: Most browsers allow cookie management</li>
              <li>Cookie consent banner: Accept/decline non-essential cookies</li>
              <li>Do Not Track: We honor browser Do Not Track signals</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>6. Cookie Management</h2>
            <p>You can:</p>
            <ul>
              <li>Enable/disable cookies in your browser settings</li>
              <li>Delete cookies at any time</li>
              <li>Use cookie management tools</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>7. Updates to Cookie Policy</h2>
            <p>We may update this policy as our services evolve. Check back periodically.</p>
          </section>

          <div class="cta-section">
            <p>Questions about cookies? Contact our support team!</p>
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

    .cookie-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: var(--spacing-md);
    }

    .cookie-table th,
    .cookie-table td {
      padding: var(--spacing-md);
      text-align: left;
      border-bottom: 1px solid var(--color-border-light);
    }

    .cookie-table th {
      background: var(--color-bg-secondary);
      font-weight: 600;
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
export class CookiePolicyComponent {}
