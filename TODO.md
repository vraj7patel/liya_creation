# Checkout & Stripe Payment Integration TODO

## Current Status: [Completed]

### 1. [x] Frontend Updates (liya-frontend/src/app/checkout/pages/checkout/checkout.component.ts)
   - [x] Remove UPI payment option
   - [x] Modernize UI: Payment cards with icons, selected state highlight, fade-in animation
   - [x] Add COD limit validation (₹5000 max) — frontend warning + submit guard
   - [x] Use environment variable for Stripe PK key

### 2. [x] Backend Updates (liya-backend/controllers/orderController.js)
   - [x] COD max amount validation (₹5000) — already present, removed upi from paymentStatus logic

### 3. [x] Environment Config
   - [x] Added STRIPE_PK_KEY to liya-frontend/src/environments/environment.ts

### 4. [x] Dependencies & Testing
   - [x] Stripe package verified (stripe ^21.0.1 in backend, @stripe/stripe-js in frontend)
   - [ ] Test COD flow (under/over limit)
   - [ ] Test Stripe PaymentIntent + card payment
