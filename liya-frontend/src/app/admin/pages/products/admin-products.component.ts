import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-products">
      <div class="header">
        <h1>Product Management</h1>
        <button class="btn-primary" routerLink="/admin/products/new">Add New Product</button>
      </div>
      
      <!-- Category Breakdown -->
      <div class="category-summary" *ngIf="categoryBreakdown.length > 0">
        <h2>Products by Category</h2>
        <div class="category-grid">
          <div class="category-card" *ngFor="let cat of categoryBreakdown; let i = index">
            <h3>{{ cat._id }}</h3>
            <p class="count">{{ animCatCounts[i] }} Products</p>
            <p class="stock">Total Stock: {{ animCatStock[i] }}</p>
          </div>
        </div>
      </div>
      
      <div class="products-table">
        <h2>All Products ({{ animTotal }})</h2>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td><img [src]="productService.getImageUrl(product.images[0])" alt="" width="50"></td>
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.price | currency:'INR' }}</td>
              <td>{{ product.stock }}</td>
              <td>
                <button class="btn-edit" [routerLink]="['/admin/products', product._id]">Edit</button>
                <button class="btn-delete" (click)="deleteProduct(product._id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-products { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .btn-primary { background: #d63384; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    
    .category-summary { margin-bottom: 30px; }
    .category-summary h2 { margin-bottom: 15px; }
    .category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
    .category-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e0e0e0; }
    .category-card h3 { margin: 0 0 10px; color: #333; }
    .category-card .count { font-size: 24px; font-weight: bold; color: #d63384; margin: 0; }
    .category-card .stock { font-size: 14px; color: #666; margin: 5px 0 0; }
    
    .products-table h2 { margin-bottom: 15px; }
    .products-table table { width: 100%; border-collapse: collapse; }
    .products-table th, .products-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    .btn-edit { background: #0d6efd; color: white; padding: 5px 10px; border: none; border-radius: 4px; margin-right: 5px; cursor: pointer; }
    .btn-delete { background: #dc3545; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: any[] = [];
  categoryBreakdown: { _id: string; count: number; totalStock: number }[] = [];
  animTotal = 0;
  animCatCounts: number[] = [];
  animCatStock: number[] = [];
  private timers: any[] = [];

  constructor(public productService: ProductService) {}

  ngOnInit() { this.loadProducts(); }
  ngOnDestroy() { this.timers.forEach(t => clearInterval(t)); }

  private animateCount(target: number, duration: number, setter: (v: number) => void): void {
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;
    const increment = target / steps;
    const t = setInterval(() => {
      current += increment;
      if (current >= target) { setter(Math.round(target)); clearInterval(t); }
      else { setter(Math.round(current)); }
    }, stepTime);
    this.timers.push(t);
  }

  loadProducts() {
    this.productService.getAdminProducts().subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.data.products;
          this.categoryBreakdown = res.data.categoryBreakdown;
          this.timers.forEach(t => clearInterval(t)); this.timers = [];
          this.animateCount(this.products.length, 1200, v => this.animTotal = v);
          this.animCatCounts = this.categoryBreakdown.map(() => 0);
          this.animCatStock = this.categoryBreakdown.map(() => 0);
          this.categoryBreakdown.forEach((cat, i) => {
            this.animateCount(cat.count, 1200, v => this.animCatCounts[i] = v);
            this.animateCount(cat.totalStock, 1200, v => this.animCatStock[i] = v);
          });
        }
      },
      error: (err) => console.error(err)
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error(err)
      });
    }
  }
}
