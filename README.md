# Liya Creation - E-Commerce Website

A women's clothing e-commerce platform built with Angular, Node.js, Express, and MongoDB.

## Features
- Session-based Authentication (no JWT)
- Product Catalog (Lehengas, saree, Gowns, Kurtis)
- Shopping Cart & Checkout
- User Dashboard
- Admin Panel

## Tech Stack

### Frontend
- Angular 17
- TypeScript
- SCSS

### Backend
- Node.js
- Express.js
- MongoDB
- express-session (session-based auth)
- bcryptjs

## Quick Start

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Installation

1. Install backend dependencies:
```
bash
cd liya-backend
npm install
```

2. Install frontend dependencies:
```bash
cd liya-frontend
npm install
```

### Running the Application

1. Start MongoDB (if not running)

2. Start the backend:
```
bash
cd liya-backend
npm start
```
Backend runs on http://localhost:3000

3. Start the frontend (in a new terminal):
```
bash
cd liya-frontend
npx ng serve
```
Frontend runs on http://localhost:4200

### Default Login Credentials

**Admin Account:**
- Email: admin@liyacreation.com
- Password: admin123

**User Account:**
Register through the app at http://localhost:4200/auth/register

## Project Structure

```
liyacreation/
├── liya-backend/          # Node.js + Express API
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── server.js         # Entry point
│
└── liya-frontend/        # Angular Application
    └── src/
        └── app/
            ├── core/          # Services, guards, interceptors
            ├── shared/        # Header, footer components
            ├── auth/          # Login, register
            ├── user/          # User dashboard
            ├── admin/         # Admin panel
            ├── products/      # Product listing & details
            ├── cart/          # Shopping cart
            └── checkout/      # Checkout page
```

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products (Admin)
- PUT /api/products/:id (Admin)
- DELETE /api/products/:id (Admin)

### Orders
- POST /api/orders
- GET /api/orders/my-orders
- GET /api/orders (Admin)
- PUT /api/orders/:id/status (Admin)

## License
Private - Liya Creation
