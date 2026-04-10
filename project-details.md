# Liya Creation - Premium Ethnic Wear E-commerce
Liya Creation is a full-stack MEAN e-commerce platform for premium ethnic wear featuring product catalog, shopping cart, order management, admin dashboard, and user authentication with Google OAuth.
- Developer: BCA Project | Tech Stack: Angular 17 / Node.js + Express / MongoDB (Mongoose) | Deployment: Local development (localhost:4200 frontend, :3000 backend).

## Tech Stack Overview
| Layer | Technology | Version/Packages | Purpose |
|-------|------------|------------------|---------|
| Frontend | Angular | 17.0.0 (HttpClient, Router, Forms, Animations) | SPA with routing, services, guards, responsive UI |
| Backend | Node.js + Express | 4.18.2 (Passport, Multer, Nodemailer) | REST APIs, session/JWT auth, file uploads |
| Database | MongoDB | Mongoose 8.0.0 | Schemas: Product, User, Order, Cart, Category, Wishlist |
| Tools | VS Code, Git, Nodemon, ng CLI | - | Development, hot reload, building |

## API Endpoints
```
GET    /api/products              # List all products
GET    /api/products/:id          # Get single product
GET    /api/products/featured     # Featured products
GET    /api/products/category/:category # Products by category
POST   /api/products              # Create product (admin, multipart images)
PUT    /api/products/:id          # Update product (admin)
DELETE /api/products/:id          # Delete product (admin)
GET    /api/auth/login            # User login (Passport local)
POST   /api/auth/register         # User signup
GET    /api/auth/google           # Google OAuth (Passport)
GET    /api/cart                  # Get user cart
POST   /api/cart                  # Add/update cart (assumed)
GET    /api/orders                # User orders
POST   /api/orders                # Place order
GET    /api/wishlist              # User wishlist
GET    /api/categories            # Product categories
GET    /api/health                # API health check
```
- Authentication: Session + Passport (Local, Google OAuth), middleware isAuthenticated/isAdmin

## Core Features & Components
**User Panel**
- Product catalog browsing with filters (product-list, product-detail)
- Shopping cart (add/remove/update) with persistence
- Wishlist management
- Order placement, history, tracking
- User profile/dashboard, order details
- Static pages: Home, Contact, FAQ, Shipping, Returns, Size Guide
- Responsive components: header, footer, premium-product-card, shop-by-category, quick-view-modal

**Admin Panel**
- Product CRUD operations with image uploads (admin-products)
- Order management dashboard (admin-dashboard)
- User management
- Category management

## MongoDB Schemas
```javascript
// models/Product.js
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: [100, 'Product name cannot exceed 100 characters'] },
  description: { type: String, required: true, maxlength: [2000, 'Description cannot exceed 2000 characters'] },
  price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
  category: { type: String, required: true, enum: ['Lehengas', 'saree', 'Gowns', 'Kurtis'] },
  images: [String],
  sizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'] }],
  stock: { type: Number, required: true, min: 0, default: 0 },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// models/User.js (inferred structure)
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String, // hashed with bcryptjs
  role: { type: String, enum: ['user', 'admin'] },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});
```

## Angular Components Structure
```
src/app/
├── core/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   ├── wishlist.service.ts
│   │   └── order.service.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── admin.guard.ts
│   └── interceptors/
│       └── auth.interceptor.ts
├── shared/components/
│   ├── header/
│   ├── footer/
│   ├── premium-product-card/
│   └── shop-by-category/
├── admin/pages/
│   ├── dashboard/
│   ├── products/
│   └── orders/
├── user/pages/
│   ├── dashboard/
│   ├── orders/
│   └── order-details/
├── products/pages/
│   ├── product-list/
│   └── product-detail/
├── cart/pages/cart/
├── wishlist/pages/wishlist/
├── checkout/pages/checkout/
└── auth/pages/
    ├── login/
    └── register/
```

## Key Implementation Details
- **Routing**: Lazy-loaded modules with auth/admin guards
- **State Management**: Injectable services with RxJS Observables/BehaviorSubjects
- **Forms**: Reactive Forms with validation (inferred for register/product forms)
- **Notifications**: Likely SnackBar or custom toasts for cart updates, login
- **Error Handling**: Global HTTP auth interceptor for token/session handling
- **File Uploads**: Multer array('images',5) for products, served at /uploads
- **Security**: Helmet, rate-limit, CORS, bcryptjs hashing, session store in MongoDB

## Project Setup & Deployment
**Local Development**
```
# Backend
cd liya-backend
npm install
npm run dev  # Runs on localhost:3000 (nodemon)

# Frontend  
cd liya-frontend
npm install
ng serve     # Runs on localhost:4200 (proxies /api to :3000)

# Database
mongod       # or MongoDB Atlas via .env MONGODB_URI
npm run seed # Optional: cd liya-backend && npm run seed
```

**Common Issues Fixed**
- POST /api/products 500: Multer validation, required fields (name,price,category,stock)
- MongoDB connection: Configured in config/db.js with env vars
- CORS: Allows localhost:4200 with credentials for sessions

## Frontend:Backend Communication Flow
1. Angular HttpClient (with auth interceptor) → Express routes (/api/*)
2. Express middleware (authMiddleware → isAuthenticated/isAdmin) → Controllers
3. Controllers → Mongoose models → MongoDB queries
4. JSON Response → Angular services → Components via Observables

## Quick Start for Developers
```
cd liya-backend && npm install && npm run dev
cd ../liya-frontend && npm install && ng serve
Visit: http://localhost:4200
Admin Login: admin@liyacreation.com / admin123 (seed data)
