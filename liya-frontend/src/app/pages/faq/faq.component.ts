import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="faq-page">
      <div class="page-header">
        <div class="container">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to the most common questions</p>
        </div>
      </div>

      <div class="container">
        <div class="faq-content">
          <div class="faq-section">
            <h2>Orders & Shopping</h2>
            
            <div class="faq-item" (click)="toggleFaq(1)" [class.active]="activeFaq === 1">
              <div class="faq-question">
                <span>How do I place an order?</span>
                <i class="fas" [class.fa-chevron-down]="activeFaq !== 1" [class.fa-chevron-up]="activeFaq === 1"></i>
              </div>
              <div class="faq-answer" *ngIf="activeFaq === 1">
                <p>Simply browse our collection, select your desired item, choose the size and color, and click "Add to Cart". Once you're ready, proceed to checkout and follow the steps to complete your purchase.</p>
              </div>
            </div>

            <div class="faq-item" (click)="toggleFaq(2)" [class.active]="activeFaq === 2">
              <div class="faq-question">
                <span>Can I modify or cancel my order after placing it?</span>
                <i class="fas" [class.fa-chevron-down]="activeFaq !== 2" [class.fa-chevron-up]="activeFaq === 2"></i>
              </div>
              <div class="faq-answer" *ngIf="activeFaq === 2">
                <p>You can modify or cancel your order within 24 hours of placing it, provided it hasn't been shipped yet. Please contact our customer support immediately with your order details.</p>
              </div>
            </div>

            <div class="faq-item" (click)="toggleFaq(3)" [class.active]="activeFaq === 3">
              <div class="faq-question">
                <span>How do I know my order is confirmed?</span>
                <i class="fas" [class.fa-chevron-down]="activeFaq !== 3" [class.fa-chevron-up]="activeFaq === 3"></i>
              </div>
              <div class="faq-answer" *ngIf="activeFaq === 3">
                <p>Once your order is placed, you'll receive an order confirmation email with your order number. You can also track your order status in your account under "My Orders".</p>
              </div>
            </div>
          </div>

          <div class="faq-section">
            <h2>Shipping & Delivery</h2>
            
            <div class="faq-item" (click)="toggleFaq(4)" [class.active]="activeFaq === 4">
              <div class="faq-question">
                <span>How long will delivery take?</span>
                <i class="fas" [class.fa-chevron-down]="activeFaq !== 4" [class.fa-chevron-up]="activeFaq === 4"></i>
              </div>
              <div class="faq-answer" *ngIf="activeFaq === 4">
                <p>Standard shipping takes 5-7 business days. Express shipping (2-3 days) and next-day delivery options are also available at checkout.</p>
              </div>
            </div>

            <div class="faq-item" (click)="toggleFaq(5)" [class.active]="activeFaq === 5">
              <div class="faq-question">
                <span>Do you ship internationally?</span>
                <i class="fas" [class.fa-chevron-down]="activeFaq !== 5" [class.fa-chevron-up]="activeFaq === 5"></i>
              </div>
              <div class="faq-answer" *ngIf="activeFaq === 5">
                <p>Yes, we ship internationally. Please contact us at info&#64;liyacreation.com for international shipping rates and delivery times.</p>
              </div>
            </div>

            <div class="faq-item" (click)="toggleFaq(6)" [class.active]="activeFaq === 6">
              <div class="faq-question">
                <span>How can I track my order?</span>
                <i class="fas" [class.fa-chevron-down]="activeFaq !== 6" [class.fa-chevron-up]="activeFaq === 6"></i>
              </div>
              <div class="faq-answer" *ngIf="activeFaq === 6">
                <p>You'll receive a tracking number via SMS and email once your order is shipped. You can track your order using the tracking link or on our website's Track Order page.</p>
              </div>
            </div>
          </div>

          <div class="faq-section">
            <h2>Returns & Exchanges</h2>
            
            <div class="faq-item" (click)="toggleFaq(7)" [class.active]="activeFaq === 7">
              <div class="faq-question">
                <span>What is your return policy?</span>
                <i class="fas" [class.fa-chevron-down]="activeFaq !== 7" [class.fa-chevron-up]="activeFaq === 7"></i>
              </div>
              <div class="faq-answer" *ngIf="activeFaq === 7">
                <p>We offer a 30-day return policy for most items. Items must be unused, unworn, and with original tags attached. Customized items can only be returned if there's a manufacturing defect.</p>
              </div>
            </div>

            <div class="faq-item" (click)="toggleFaq(8)" [class.active]="activeFaq === 8">
              <div class="faq-question">
                <span>How do I initiate a return?</span>
                <i class="fas" [class.fa-chevron-down]="activeFaq !== 8" [class.fa-chevron-up]="activeFaq === 8"></i>
              </div>
              <div class="faq-answer" *ngIf="activeFaq === 8">
                <p>Log in to your account, go to "My Orders", select the order, click "Return Item", and choose the reason for return. Our team will review and guide you through the process.</p>
              </div>
            </div>

            <div class="faq-item" (click)="toggleFaq(9)" [class.active]="activeFaq === 9">
              <div class="faq-question">
                <span>When will I receive my refund?</span>
                <i class="fas" [class.fa-chevron-down]="activeFaq !== 9" [class.fa-chevron-up]="activeFaq === 9"></i>
              </div>
              <div class="faq-answer" *ngIf="activeFaq === 9">
                <p>Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method.</p>
              </div>
            </div>
          </div>

          <div class="faq-section">
            <h2>Products & Sizing</h2>
            
            <div class="faq-item" (click)="toggleFaq(10)" [class.active]="activeFaq === 10">
              <div class="faq-question">
                <span>How do I find my correct size?</span>
                <i class="fas" [class.fa-chevron-down]="activeFaq !== 10" [class.fa-chevron-up]="activeFaq === 10"></i>
              </div>
              <div class="faq-answer" *ngIf="activeFaq === 10">
                <p>Please refer to our <a routerLink="/size-guide">Size Guide</a> page for detailed measurements. If you're between sizes, we recommend sizing up for a comfortable fit.</p>
              </div>
            </div>

            <div class="faq-item" (click)="toggleFaq(11)" [class.active]="activeFaq === 11">
              <div class="faq-question">
                <span>Are the colors shown on the website accurate?</span>
                <i class="fas" [class.fa-chevron-down]="activeFaq !== 11" [class.fa-chevron-up]="activeFaq === 11"></i>
              </div>
              <div class="faq-answer" *ngIf="activeFaq === 11">
                <p>We strive to show accurate colors, but slight variations may occur due to monitor settings. If you receive an item that significantly differs from the photo, please contact us.</p>
              </div>
            </div>

            <div class="faq-item" (click)="toggleFaq(12)" [class.active]="activeFaq === 12">
              <div class="faq-question">
                <span>Do you offer customization or stitching services?</span>
                <i class="fas" [class.fa-chevron-down]="activeFaq !== 12" [class.fa-chevron-up]="activeFaq === 12"></i>
              </div>
              <div class="faq-answer" *ngIf="activeFaq === 12">
                <p>Yes, we offer customization services for certain items. Please contact us with your requirements for more information on pricing and delivery time.</p>
              </div>
            </div>
          </div>

          <div class="cta-section">
            <p>Still have questions? We're here to help!</p>
            <a routerLink="/contact" class="btn btn-primary">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .faq-page {
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

    .faq-content {
      max-width: 800px;
      margin: 0 auto;
      padding-bottom: var(--spacing-4xl);
    }

    .faq-section {
      margin-bottom: var(--spacing-xl);
    }

    .faq-section h2 {
      font-family: var(--font-heading);
      font-size: var(--font-size-xl);
      margin-bottom: var(--spacing-lg);
      color: var(--color-text);
    }

    .faq-item {
      background: var(--color-bg-light);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-md);
      overflow: hidden;
      cursor: pointer;
      transition: all var(--transition-smooth);
    }

    .faq-item:hover {
      box-shadow: var(--shadow-md);
    }

    .faq-question {
      padding: var(--spacing-lg);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: var(--font-weight-medium);
      color: var(--color-text);
    }

    .faq-question i {
      color: var(--color-secondary);
      transition: transform var(--transition-smooth);
    }

    .faq-item.active .faq-question i {
      transform: rotate(180deg);
    }

    .faq-answer {
      padding: 0 var(--spacing-lg) var(--spacing-lg);
      color: var(--color-text-light);
      line-height: 1.8;
    }

    .faq-answer a {
      color: var(--color-secondary);
      text-decoration: none;
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
export class FaqComponent {
  activeFaq: number | null = null;

  toggleFaq(id: number): void {
    this.activeFaq = this.activeFaq === id ? null : id;
  }
}
