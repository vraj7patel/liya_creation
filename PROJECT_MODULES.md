# Liya Creation - Project Modules

This document provides a comprehensive list of all modules/components in the Liya Creation e-commerce platform, organized by backend (Node.js/Express/MongoDB) and frontend (Angular 17). Each module includes key files with brief descriptions.

## Backend Modules (liya-backend/)

### 1. Config (`config/`)
- **db.js**: MongoDB connection setup using Mongoose.
- **passport.js**: Passport.js configuration for local and Google OAuth strategies.
- **email.js**: Nodemailer configuration for email functionalities (e.g., password reset).
- **clerk.js**: Clerk authentication integration (additional auth provider).

### 2. Models (`models/`)
- **User.js**: User schema (email, password hash, role: user/admin, orders, cart, wishlist refs).
- **Product.js**: Product schema (name, description, price, category, images[], sizes[], stock, isFeatured).
- **Category.js**: Category schema for product categorization (Lehengas, Sarees, Gowns, Kurtis).
- **Order.js**: Order schema (user ref, products, total, status, shipping details).
- **Cart.js**: Cart schema (user ref, products with quantity).
- **Wishlist.js**: Wishlist schema (user ref, product refs).

### 3. Controllers (`controllers/`)
- **authController.js**: User registration, login, Google OAuth, password reset.
- **productController.js**: CRUD for products (create/update with Multer image upload, get by id/category/featured).
- **categoryController.js**: CRUD for categories.
- **userController.js**: User profile updates, dashboard data.
- **orderController.js**: Order creation, listing, status updates.
- **cartController.js**: Cart add/remove/update/get.
- **wishlistController.js**: Wishlist add/remove/get.

### 4. Routes (`routes/`)
- **authRoutes.js**: `/api/auth/*` (login, register, google, reset-password).
- **productRoutes.js**: `/api/products/*` (list, create, update, delete, featured, category).
- **categoryRoutes.js**: `/api/categories/*`.
- **userRoutes.js**: `/api/users/*`.
- **orderRoutes.js**: `/api/orders/*`.
- **cartRoutes.js**: `/api/cart/*`.
- **wishlistRoutes.js**: `/api/wishlist/*`.

### 5. Middleware (`middleware/`)
- **authMiddleware.js**: Authentication checks (isAuthenticated, isAdmin).
- **upload.js**: Multer middleware for product image uploads (array of 5 images).

### 6. Core Files
- **server.js**: Main Express app setup, middleware (CORS, sessions, body-parser), route registration, error handling.
- **seed.js**: Database seeding script for initial products/users/categories.
- **package.json**: Backend dependencies (express, mongoose, passport, multer, bcryptjs, nodemailer, etc.).

## Frontend Modules (liya-frontend/src/app/)

### 1. Core (`core/`)
#### Services (`services/`)
- **auth.service.ts**: Authentication (login, register, logout, token/session handling).
- **product.service.ts**: Product API calls (list, detail, featured, filters).
- **cart.service.ts**: Cart management (add/remove, persistence via BehaviorSubject).
- **wishlist.service.ts**: Wishlist operations.
- **order.service.ts**: Orders (list, create, track).
- **clerk.service.ts**: Clerk auth integration.

#### Guards (`guards/`)
- **auth.guard.ts**: Protects user routes.
- **admin.guard.ts**: Protects admin routes.

#### Interceptors (`interceptors/`)
- **auth.interceptor.ts**: Automatic auth headers/tokens for HTTP requests.

### 2. Shared Components (`shared/components/`)
- **header/header.component.ts**: Navigation bar, cart/wishlist indicators.
- **footer/footer.component.ts**: Site footer with links.
- **premium-product-card/**: Reusable product card for grids/home (with images, price, quick add).
- **shop-by-category/**: Category browsing component.
- **quick-view-modal/**: Product quick view modal.

### 3. Feature Pages by Module
#### Auth (`auth/pages/`)
- **login/login.component.ts**
- **register/register.component.ts**

#### Products (`products/pages/`)
- **product-list/product-list.component.ts**
- **product-detail/product-detail.component.ts**

#### Cart (`cart/pages/`)
- **cart/cart.component.ts**

#### Wishlist (`wishlist/pages/`)
- **wishlist/wishlist.component.ts**

#### Checkout (`checkout/pages/`)
- **checkout/checkout.component.ts**

#### User (`user/pages/`)
- **dashboard/dashboard.component.ts**
- **orders/orders.component.ts**
- **order-details/order-details.component.ts**

#### Admin (`admin/pages/`)
- **dashboard/admin-dashboard.component.ts**
- **products/admin-products.component.ts** (CRUD)

#### Static Pages (`pages/`)
- **home/home.component.ts**
- **contact/contact.component.ts**
- **faq/faq.component.ts**
- **shipping/shipping.component.ts**
- **return/return.component.ts**
- **size-guide/size-guide.component.ts**
- **track-order/track-order.component.ts**

### 4. Routing & Config
- **app.routes.ts**: Root routing configuration.
- **admin.routes.ts**, **user.routes.ts**, **auth.routes.ts**: Lazy-loaded feature routes.

### 5. Core App Files
- **app.component.ts**: Root component.
- **app.config.ts**: Angular providers (HTTP, Router, etc.).
- **main.ts**: App bootstrap.
- **environments/environment.ts**: API base URL (proxied to backend).

## Summary
- **Backend**: 6 models, 7 controllers, 7 route files, 2 middleware, 4 config – RESTful API with auth/uploads.
- **Frontend**: 6 services, 2 guards, 1 interceptor, 10+ shared/feature components/pages, lazy routing.
- Total: ~50 key modules for full e-commerce flow (browse → cart → checkout → admin).

This list is derived from project file structure and existing documentation.
