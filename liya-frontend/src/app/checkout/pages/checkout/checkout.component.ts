import { Component, inject, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { AddressService } from '../../../core/services/address.service';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  size: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="checkout-page">
      <div class="container">
        <h1>Checkout</h1>

        @if (isPageLoading) {
          <div class="loading">Loading order...</div>
        } @else if (orderItems.length === 0 && cartService.cartItems().length === 0) {
          <div class="empty-cart">
            <h2>Your cart is empty</h2>
            <a routerLink="/products" class="btn btn-primary">Continue Shopping</a>
          </div>
        } @else {
          <div class="checkout-layout">
            <div class="checkout-form">
              <div class="shipping-header">
                <h2>Shipping Information</h2>
                @if (hasSavedAddress) {
                  <button type="button" class="autofill-btn" (click)="autofillAddress()">
                    <i class="fas fa-map-marker-alt"></i> Use Saved Address
                  </button>
                }
              </div>
              
              <form [formGroup]="checkoutForm" (ngSubmit)="placeOrder()">
                <div class="form-group">
                  <label>Full Name *</label>
                  <input type="text" formControlName="fullName" placeholder="Enter your full name"
                    (keypress)="onlyText($event)" (input)="sanitizeText($event, 'fullName')"
                    [class.error-border]="checkoutForm.get('fullName')?.touched && checkoutForm.get('fullName')?.invalid">
                  @if (checkoutForm.get('fullName')?.touched && checkoutForm.get('fullName')?.invalid) {
                    <span class="error-text">Full name is required</span>
                  }
                </div>

                <div class="form-group">
                  <label>Address *</label>
                  <textarea formControlName="address" placeholder="Enter your address" rows="3"
                    [class.error-border]="checkoutForm.get('address')?.touched && checkoutForm.get('address')?.invalid"></textarea>
                  @if (checkoutForm.get('address')?.touched && checkoutForm.get('address')?.invalid) {
                    <span class="error-text">Address is required</span>
                  }
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>City *</label>
                    <input type="text" formControlName="city" placeholder="City"
                      (keypress)="onlyText($event)" (input)="sanitizeText($event, 'city')"
                      [class.error-border]="checkoutForm.get('city')?.touched && checkoutForm.get('city')?.invalid">
                    @if (checkoutForm.get('city')?.touched && checkoutForm.get('city')?.invalid) {
                      <span class="error-text">City is required</span>
                    }
                  </div>
                  <div class="form-group">
                    <label>State *</label>
                    <input type="text" formControlName="state" placeholder="State"
                      (keypress)="onlyText($event)" (input)="sanitizeText($event, 'state')"
                      [class.error-border]="checkoutForm.get('state')?.touched && checkoutForm.get('state')?.invalid">
                    @if (checkoutForm.get('state')?.touched && checkoutForm.get('state')?.invalid) {
                      <span class="error-text">State is required</span>
                    }
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Pincode *</label>
                    <input type="text" formControlName="pincode" placeholder="Pincode" maxlength="6"
                      (keypress)="onlyDigits($event)" (input)="sanitizeDigits($event, 'pincode')"
                      [class.error-border]="checkoutForm.get('pincode')?.touched && checkoutForm.get('pincode')?.invalid">
                    @if (checkoutForm.get('pincode')?.touched && checkoutForm.get('pincode')?.invalid) {
                      <span class="error-text">Enter a valid 6-digit pincode</span>
                    }
                  </div>
                  <div class="form-group">
                    <label>Phone *</label>
                    <input type="tel" formControlName="phone" placeholder="10-digit phone number" maxlength="10"
                      (keypress)="onlyDigits($event)" (input)="sanitizeDigits($event, 'phone')"
                      [class.error-border]="checkoutForm.get('phone')?.touched && checkoutForm.get('phone')?.invalid">
                    @if (checkoutForm.get('phone')?.touched && checkoutForm.get('phone')?.invalid) {
                      <span class="error-text">Enter a valid 10-digit phone number</span>
                    }
                  </div>
                </div>

                <div class="payment-section">
                  <h2>Payment Method</h2>
                  <div class="payment-options">
                    <label class="payment-option" [class.selected]="selectedPaymentMethod === 'COD'">
                      <input type="radio" formControlName="paymentMethod" value="COD">
                      <span class="option-content">
                        <span class="option-icon">🏠</span>
                        <span class="option-label">
                          <strong>Cash on Delivery</strong>
                          <small>Pay when your order arrives</small>
                        </span>
                      </span>
                    </label>
                    <label class="payment-option" [class.selected]="selectedPaymentMethod === 'card'">
                      <input type="radio" formControlName="paymentMethod" value="card">
                      <span class="option-content">
                        <span class="option-icon">💳</span>
                        <span class="option-label">
                          <strong>Credit / Debit Card</strong>
                          <small>Visa, Mastercard, RuPay</small>
                        </span>
                      </span>
                    </label>
                  </div>

                  @if (selectedPaymentMethod === 'COD' && displayTotal > 5000) {
                    <div class="alert alert-warning">
                      ⚠️ COD is only available for orders up to ₹5000. Please use Card payment.
                    </div>
                  }

                  @if (selectedPaymentMethod === 'card') {
                    <div class="payment-details">
                      <div id="stripe-card-element" class="stripe-card-element"></div>
                      <div id="stripe-card-errors" class="stripe-error"></div>
                    </div>
                  }
                </div>

                @if (errorMessage) {
                  <div class="alert alert-error">{{ errorMessage }}</div>
                }

                <button type="submit" class="btn btn-primary btn-block" 
                        [disabled]="isSubmitting || checkoutForm.invalid">
                  @if (isSubmitting) {
                    Processing...
                  } @else {
                    Place Order (₹{{ displayTotal }})
                  }
                </button>
              </form>
            </div>

            <div class="order-summary">
              <h2>Order Summary</h2>
              <div class="summary-items">
                @for (item of displayItems; track item.product._id + item.size) {
                  <div class="summary-item">
                    <div class="item-info">
                      <h3>{{ item.product.name }}</h3>
                      <p>Size: {{ item.size }} | Qty: {{ item.quantity }}</p>
                    </div>
                    <span class="item-price">₹{{ item.product.price * item.quantity }}</span>
                  </div>
                }
              </div>
              <div class="summary-totals">
                <div class="total-row">
                  <span>Subtotal</span>
                  <span>₹{{ displayTotal }}</span>
                </div>
                <div class="total-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div class="total-row grand-total">
                  <span>Total</span>
                  <span>₹{{ displayTotal }}</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { padding: 40px 0 80px; min-height: 100vh; background: var(--color-bg); }
    h1 { font-family: var(--font-heading); font-size: var(--font-size-4xl); margin-bottom: 30px; color: var(--color-text); }
    .checkout-layout { display: grid; grid-template-columns: 1fr 400px; gap: 40px; align-items: start; }
    .checkout-form { background: var(--color-bg-light); border-radius: var(--radius-xl); padding: 32px; border: 1px solid var(--color-border-light); }
    .checkout-form h2 { font-family: var(--font-heading); font-size: var(--font-size-xl); margin-bottom: 20px; color: var(--color-text); }
    .shipping-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .shipping-header h2 { margin-bottom: 0; }
    .autofill-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark)); color: white; border: none; border-radius: var(--radius-md); font-size: var(--font-size-xs); font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
    .autofill-btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-glow); }
    .checkout-form .form-group { margin-bottom: 20px; }
    .checkout-form .form-group label { display: block; margin-bottom: 8px; font-weight: 500; font-size: var(--font-size-sm); color: var(--color-text); }
    .checkout-form .form-group input, .checkout-form .form-group textarea { width: 100%; padding: 12px 15px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-sm); font-family: var(--font-body); transition: border-color 0.2s; }
    .checkout-form .form-group input:focus, .checkout-form .form-group textarea:focus { outline: none; border-color: var(--color-secondary); box-shadow: 0 0 0 3px rgba(212,165,116,0.15); }
    .checkout-form .form-group input.error-border, .checkout-form .form-group textarea.error-border { border-color: var(--color-error); }
    .checkout-form .form-group .error-text { color: var(--color-error); font-size: 12px; margin-top: 5px; display: block; }
    .checkout-form .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .payment-section { margin-top: 30px; padding-top: 24px; border-top: 1px solid var(--color-border-light); }
    .payment-section h2 { font-family: var(--font-heading); font-size: var(--font-size-xl); margin-bottom: 16px; color: var(--color-text); }
    .payment-options { display: flex; flex-direction: column; gap: 12px; }
    .payment-option { display: flex; align-items: center; padding: 16px; border: 2px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s; }
    .payment-option:hover { border-color: var(--color-secondary); background: rgba(212,165,116,0.04); }
    .payment-option.selected { border-color: var(--color-secondary); background: rgba(212,165,116,0.08); }
    .payment-option input { margin-right: 14px; accent-color: var(--color-secondary); width: 18px; height: 18px; flex-shrink: 0; }
    .option-content { display: flex; align-items: center; gap: 12px; }
    .option-icon { font-size: 24px; line-height: 1; }
    .option-label { display: flex; flex-direction: column; gap: 2px; }
    .option-label strong { font-size: var(--font-size-sm); color: var(--color-text); }
    .option-label small { font-size: 11px; color: var(--color-text-muted); }
    .payment-details { margin-top: 16px; padding: 16px; background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border-light); animation: fadeIn 0.2s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
    .alert-warning { background: rgba(255,193,7,0.1); color: #856404; border: 1px solid rgba(255,193,7,0.4); }
    .order-summary { background: var(--color-bg-light); padding: 28px; border-radius: var(--radius-xl); border: 1px solid var(--color-border-light); position: sticky; top: 100px; }
    .order-summary h2 { font-family: var(--font-heading); font-size: var(--font-size-xl); margin-bottom: 20px; color: var(--color-text); padding-bottom: 16px; border-bottom: 1px solid var(--color-border-light); }
    .summary-items { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--color-border-light); }
    .summary-item { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; gap: 12px; }
    .summary-item .item-info h3 { font-size: var(--font-size-sm); font-weight: 600; margin-bottom: 4px; color: var(--color-text); }
    .summary-item .item-info p { font-size: 12px; color: var(--color-text-muted); margin: 0; }
    .summary-item .item-price { font-weight: 600; color: var(--color-text); white-space: nowrap; }
    .summary-totals .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: var(--font-size-sm); color: var(--color-text-light); border-bottom: 1px solid var(--color-border-light); }
    .summary-totals .total-row.grand-total { border-top: 2px solid var(--color-border); border-bottom: none; margin-top: 8px; padding-top: 14px; font-family: var(--font-heading); font-size: var(--font-size-lg); font-weight: 700; color: var(--color-primary); }
    .btn-block { width: 100%; padding: 15px; margin-top: 20px; font-size: var(--font-size-base); }
    .btn { background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark)); color: white; padding: 12px 24px; border: none; border-radius: var(--radius-md); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; font-family: var(--font-body); font-weight: 600; transition: all 0.3s ease; }
    .btn-primary { background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark)); color: white; }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-glow); }
    .btn:disabled { background: #ccc; cursor: not-allowed; transform: none; }
    .alert { padding: 14px 16px; border-radius: var(--radius-md); margin-top: 16px; font-size: var(--font-size-sm); }
    .alert-error { background: rgba(220,53,69,0.08); color: var(--color-error); border: 1px solid rgba(220,53,69,0.2); }
    .empty-cart { text-align: center; padding: 60px 20px; }
    .empty-cart h2 { font-family: var(--font-heading); margin-bottom: 16px; }
    .loading { text-align: center; padding: 60px; color: var(--color-text-light); }
    .stripe-card-element { padding: 12px 15px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); background: white; margin-bottom: 8px; }
    .stripe-error { color: var(--color-error); font-size: 12px; min-height: 18px; }
    @media (max-width: 992px) { .checkout-layout { grid-template-columns: 1fr; } .order-summary { position: static; } }
    @media (max-width: 576px) {
      .checkout-page { padding: 24px 0 60px; }
      h1 { font-size: var(--font-size-2xl); margin-bottom: 20px; }
      .checkout-form { padding: 20px; }
      .checkout-form .form-row { grid-template-columns: 1fr; gap: 0; }
      .order-summary { padding: 20px; }
      .btn-block { padding: 14px; font-size: var(--font-size-sm); }
      .checkout-form .form-group input,
      .checkout-form .form-group textarea { font-size: 16px; }
    }
  `]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private addressService = inject(AddressService);
  private http = inject(HttpClient);
  private zone = inject(NgZone);

  private stripe: Stripe | null = null;
  private cardElement: StripeCardElement | null = null;

  hasSavedAddress = false;
  private savedAddress: any = null;

  checkoutForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
    address: ['', Validators.required],
    city: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
    state: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
    pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    paymentMethod: ['COD', Validators.required]
  });

  selectedPaymentMethod = 'COD';

  private mountStripeCard(): void {
    if (!this.stripe) return;
    const elements = this.stripe.elements();
    this.cardElement = elements.create('card', {
      style: { base: { fontSize: '16px', color: '#2C2C2C', '::placeholder': { color: '#9B9B9B' } } }
    });
    this.cardElement.mount('#stripe-card-element');
    this.cardElement.on('change', (event) => {
      const el = document.getElementById('stripe-card-errors');
      if (el) el.textContent = event.error ? event.error.message : '';
    });
  }

  private unmountStripeCard(): void {
    if (this.cardElement) {
      this.cardElement.unmount();
      this.cardElement = null;
    }
  }

  ngOnDestroy(): void {
    this.unmountStripeCard();
  }
  markPaymentTouched(): void {}

  isPageLoading = false;
  isSubmitting = false;
  errorMessage = '';
  orderItems: OrderItem[] = [];
  orderTotal = 0;
  buyNowOrderId: string | null = null;

  ngOnInit(): void {
    // Initialize Stripe
    loadStripe(environment.stripePk).then(stripe => {
      this.stripe = stripe;
    });

    // Load saved address for autofill
    if (this.authService.isLoggedIn()) {
      this.addressService.getAddress().subscribe({
        next: (res) => {
          if (res.data?.fullName) {
            this.savedAddress = res.data;
            this.hasSavedAddress = true;
          }
        },
        error: () => {}
      });
    }

    this.route.queryParams.subscribe(params => {
      if (params['orderId']) {
        this.buyNowOrderId = params['orderId'];
        this.loadOrderForCheckout(params['orderId']);
      }
    });

    // FIXED: Track payment method changes and toggle nested form validation
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      if (method) {
        this.selectedPaymentMethod = method;
        if (method === 'card') {
          setTimeout(() => this.mountStripeCard(), 100);
        } else {
          this.unmountStripeCard();
        }
      }
    });
  }

  autofillAddress(): void {
    if (!this.savedAddress) return;
    this.checkoutForm.patchValue({
      fullName: this.savedAddress.fullName,
      address:  this.savedAddress.address,
      city:     this.savedAddress.city,
      state:    this.savedAddress.state,
      pincode:  this.savedAddress.pincode,
      phone:    this.savedAddress.phone
    });
  }

  onlyText(e: KeyboardEvent): void {
    if (!/^[a-zA-Z\s]$/.test(e.key)) e.preventDefault();
  }
  onlyDigits(e: KeyboardEvent): void {
    if (!/^\d$/.test(e.key)) e.preventDefault();
  }
  sanitizeText(e: Event, ctrl: string): void {
    const el = e.target as HTMLInputElement;
    const clean = el.value.replace(/[^a-zA-Z\s]/g, '');
    if (el.value !== clean) { el.value = clean; this.checkoutForm.get(ctrl)?.setValue(clean); }
  }
  sanitizeDigits(e: Event, ctrl: string): void {
    const el = e.target as HTMLInputElement;
    const clean = el.value.replace(/\D/g, '');
    if (el.value !== clean) { el.value = clean; this.checkoutForm.get(ctrl)?.setValue(clean); }
  }

  loadOrderForCheckout(orderId: string): void {
    this.isPageLoading = true;
    this.orderService.getOrder(orderId).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.orderItems = response.data.products.map((item: any) => ({
            product: {
              _id: item.product._id || item.product,
              name: item.name,
              price: item.price,
              images: item.image ? [item.image] : []
            },
            quantity: item.quantity,
            size: item.size
          }));
          this.orderTotal = response.data.totalAmount;
        }
        this.isPageLoading = false;
      },
      error: () => {
        this.isPageLoading = false;
        this.errorMessage = 'Failed to load order details';
      }
    });
  }

  get displayItems(): OrderItem[] {
    return this.orderItems.length > 0 ? this.orderItems : this.cartService.getCartItems() as unknown as OrderItem[];
  }

  get displayTotal(): number {
    return this.orderItems.length > 0 ? this.orderTotal : this.cartService.cartTotal();
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (this.checkoutForm.value.paymentMethod === 'COD' && this.displayTotal > 5000) {
      this.errorMessage = 'COD is only available for orders up to ₹5000. Please use Card payment.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.checkoutForm.value;

    if (formValue.paymentMethod === 'card') {
      this.http.post<any>('/api/payment/create-intent', { amount: this.displayTotal }).subscribe({
        next: async (res) => {
          if (!this.stripe || !this.cardElement) {
            this.zone.run(() => {
              this.isSubmitting = false;
              this.errorMessage = 'Stripe not loaded. Please refresh.';
            });
            return;
          }
          const { error, paymentIntent } = await this.stripe.confirmCardPayment(res.clientSecret, {
            payment_method: { card: this.cardElement }
          });
          this.zone.run(() => {
            if (error) {
              this.isSubmitting = false;
              this.errorMessage = error.message || 'Payment failed.';
            } else if (paymentIntent?.status === 'succeeded') {
              this.submitOrder(formValue);
            } else {
              this.isSubmitting = false;
              this.errorMessage = 'Payment could not be completed. Please try again.';
            }
          });
        },
        error: () => {
          this.isSubmitting = false;
          this.errorMessage = 'Could not initiate payment. Try again.';
        }
      });
      return;
    }

    this.submitOrder(formValue);
  }

  private submitOrder(formValue: any): void {
    if (this.buyNowOrderId) {
      this.isSubmitting = false;
      this.cartService.clearCart();
      this.router.navigate(['/user/orders'], { queryParams: { orderId: this.buyNowOrderId } });
      return;
    }

    const orderData: any = {
      products: this.cartService.getCartItems().map((item: any) => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size
      })),
      shippingAddress: {
        fullName: formValue.fullName || '',
        address: formValue.address || '',
        city: formValue.city || '',
        state: formValue.state || '',
        pincode: formValue.pincode || '',
        phone: formValue.phone || ''
      },
      paymentMethod: formValue.paymentMethod || 'COD'
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response.success) {
          this.cartService.clearCart();
          this.router.navigate(['/user/orders'], { queryParams: { orderId: response.data._id } });
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to place order. Please try again.';
      }
    });
  }
}