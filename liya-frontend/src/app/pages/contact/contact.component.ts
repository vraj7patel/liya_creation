import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="contact-page">
      <div class="page-header">
        <div class="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with us.</p>
        </div>
      </div>

      <div class="container">
        <div class="contact-grid">
          <div class="contact-info">
            <div class="info-card">
              <div class="icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <h3>Visit Us</h3>
              <p>Liya Creation</p>
              <p>Mumbai, Maharashtra, India</p>
            </div>

            <div class="info-card">
              <div class="icon">
                <i class="fas fa-phone-alt"></i>
              </div>
              <h3>Call Us</h3>
              <p>+91 1234567890</p>
              <p>Mon - Sat: 9AM - 7PM</p>
            </div>

            <div class="info-card">
              <div class="icon">
                <i class="fas fa-envelope"></i>
              </div>
              <h3>Email Us</h3>
              <p>info&#64;liyacreation.com</p>
              <p>support&#64;liyacreation.com</p>
            </div>

            <div class="info-card">
              <div class="icon">
                <i class="fas fa-comments"></i>
              </div>
              <h3>Follow Us</h3>
              <div class="social-links">
                <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="#" aria-label="Pinterest"><i class="fab fa-pinterest-p"></i></a>
                <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
              </div>
            </div>
          </div>

          <div class="contact-form-section">
            <h2>Send us a Message</h2>
            <form (ngSubmit)="submitForm()" #contactForm="ngForm">
              <div class="form-group">
                <label for="name">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  [(ngModel)]="formData.name" 
                  required
                  placeholder="Enter your name">
              </div>

              <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  [(ngModel)]="formData.email" 
                  required
                  placeholder="Enter your email">
              </div>

              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  [(ngModel)]="formData.phone"
                  placeholder="Enter your phone number">
              </div>

              <div class="form-group">
                <label for="subject">Subject</label>
                <select 
                  id="subject" 
                  name="subject" 
                  [(ngModel)]="formData.subject"
                  required>
                  <option value="">Select a subject</option>
                  <option value="order">Order Related</option>
                  <option value="product">Product Inquiry</option>
                  <option value="return">Return/Exchange</option>
                  <option value="bulk">Bulk Orders</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  [(ngModel)]="formData.message" 
                  required
                  rows="5"
                  placeholder="How can we help you?"></textarea>
              </div>

              <button type="submit" class="btn btn-primary" [disabled]="!contactForm.form.valid">
                <i class="fas fa-paper-plane"></i> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-page {
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

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: var(--spacing-3xl);
      padding-bottom: var(--spacing-4xl);
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .info-card {
      background: var(--color-bg-light);
      padding: var(--spacing-xl);
      border-radius: var(--radius-xl);
      text-align: center;
    }

    .info-card .icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--spacing-lg);
    }

    .info-card .icon i {
      font-size: 1.5rem;
      color: white;
    }

    .info-card h3 {
      font-family: var(--font-heading);
      font-size: var(--font-size-lg);
      margin-bottom: var(--spacing-sm);
    }

    .info-card p {
      color: var(--color-text-light);
      font-size: var(--font-size-sm);
      margin: 0;
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: var(--spacing-md);
      margin-top: var(--spacing-md);
    }

    .social-links a {
      width: 36px;
      height: 36px;
      background: var(--color-bg);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text);
      transition: all var(--transition-smooth);
    }

    .social-links a:hover {
      background: var(--color-secondary);
      color: white;
      transform: translateY(-2px);
    }

    .contact-form-section {
      background: var(--color-bg-light);
      padding: var(--spacing-2xl);
      border-radius: var(--radius-xl);
    }

    .contact-form-section h2 {
      font-family: var(--font-heading);
      font-size: var(--font-size-2xl);
      margin-bottom: var(--spacing-xl);
    }

    .form-group {
      margin-bottom: var(--spacing-lg);
    }

    .form-group label {
      display: block;
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--spacing-sm);
      color: var(--color-text);
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: var(--spacing-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      transition: border-color var(--transition-fast);
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--color-secondary);
    }

    .form-group textarea {
      resize: vertical;
    }

    @media (max-width: 992px) {
      .contact-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  submitForm(): void {
    console.log('Form submitted:', this.formData);
    alert('Thank you for your message! We will get back to you soon.');
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
  }
}
