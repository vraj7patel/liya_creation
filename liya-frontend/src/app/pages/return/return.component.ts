import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-return',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="policy-page">
      <div class="page-header">
        <div class="container">
          <h1>Return Policy</h1>
          <p>Hassle-free returns for a seamless shopping experience</p>
        </div>
      </div>

      <div class="container">
        <div class="policy-content">
          <section class="policy-section">
            <h2>Return Eligibility</h2>
            <p>We want you to love your purchase, but if you're not completely satisfied, we offer easy returns within:</p>
            <ul>
              <li><strong>30 days</strong> from the date of delivery for most items</li>
              <li><strong>7 days</strong> for sale/discounted items</li>
              <li><strong>Customized or stitched items</strong> can only be returned if there's a manufacturing defect</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>Conditions for Return</h2>
            <ul>
              <li>Items must be unused, unworn, and with all original tags attached</li>
              <li>Original packaging must be intact</li>
              <li>Item must not be altered or customized</li>
              <li>Proof of purchase (order confirmation email) must be provided</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>Non-Returnable Items</h2>
            <ul>
              <li>Customized/stitched products as per customer specifications</li>
              <li>Personal care items</li>
              <li>Sale or clearance items (unless defective)</li>
              <li>Gift cards</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>How to Initiate a Return</h2>
            <ol>
              <li>Log in to your account and go to "My Orders"</li>
              <li>Select the order containing the item you wish to return</li>
              <li>Click on "Return Item" and select the reason for return</li>
              <li>Our team will review your request within 24-48 hours</li>
              <li>Once approved, we'll arrange for a pickup or provide return shipping instructions</li>
            </ol>
          </section>

          <section class="policy-section">
            <h2>Refund Process</h2>
            <ul>
              <li>Refunds are processed within 5-7 business days after we receive the returned item</li>
              <li>Original shipping charges are non-refundable (unless the return is due to our error)</li>
              <li>Refund will be credited to your original payment method</li>
              <li>For COD orders, refund will be processed to your bank account</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>Exchange Policy</h2>
            <p>We offer exchanges for different sizes or colors, subject to availability. To initiate an exchange:</p>
            <ul>
              <li>Select "Exchange" while initiating the return</li>
              <li>Specify the size/color you need</li>
              <li>Once we receive your original item, we'll ship the replacement</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>Defective or Wrong Item Received</h2>
            <p>If you receive a defective item or wrong product, please contact us immediately with photos. We'll arrange for a free replacement or full refund.</p>
          </section>

          <div class="cta-section">
            <p>Need help? Our support team is here for you!</p>
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

    .policy-section ul, .policy-section ol {
      list-style: none;
      padding: 0;
    }

    .policy-section ul li, .policy-section ol li {
      padding: var(--spacing-sm) 0;
      color: var(--color-text-light);
      border-bottom: 1px solid var(--color-border-light);
    }

    .policy-section ul li:last-child, .policy-section ol li:last-child {
      border-bottom: none;
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
export class ReturnComponent {}
