import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  template: `
    <div class="product-form-container">
      <div class="header">
        <h1>{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</h1>
        <button class="btn-back" routerLink="/admin/products">Back to Products</button>
      </div>

      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
        <div class="form-grid">
          <!-- Basic Info -->
          <div class="form-section">
            <h3>Basic Information</h3>
            
            <div class="form-group">
              <label for="name">Product Name *</label>
              <input type="text" id="name" formControlName="name" placeholder="Enter product name"
                [class.error]="isFieldInvalid('name')">
              <span class="error-text" *ngIf="productForm.get('name')?.touched && productForm.get('name')?.errors?.['required']">Name is required</span>
              <span class="error-text" *ngIf="productForm.get('name')?.touched && productForm.get('name')?.errors?.['minlength']">Name must be at least 3 characters</span>
              <span class="error-text" *ngIf="productForm.get('name')?.touched && productForm.get('name')?.errors?.['maxlength']">Name cannot exceed 100 characters</span>
            </div>

            <div class="form-group">
              <label for="description">Description *</label>
              <textarea id="description" formControlName="description" rows="4" placeholder="Enter product description"
                [class.error]="isFieldInvalid('description')"></textarea>
              <span class="error-text" *ngIf="productForm.get('description')?.touched && productForm.get('description')?.errors?.['required']">Description is required</span>
              <span class="error-text" *ngIf="productForm.get('description')?.touched && productForm.get('description')?.errors?.['minlength']">Description must be at least 20 characters</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="price">Price (INR) *</label>
                <input type="number" id="price" formControlName="price" placeholder="0.00" min="1" step="0.01"
                  [class.error]="isFieldInvalid('price')">
                <span class="error-text" *ngIf="productForm.get('price')?.touched && productForm.get('price')?.errors?.['required']">Price is required</span>
                <span class="error-text" *ngIf="productForm.get('price')?.touched && productForm.get('price')?.errors?.['min']">Price must be at least ₹1</span>
              </div>
              <div class="form-group">
                <label for="stock">Stock *</label>
                <input type="number" id="stock" formControlName="stock" placeholder="0" min="0"
                  [class.error]="isFieldInvalid('stock')">
                <span class="error-text" *ngIf="productForm.get('stock')?.touched && productForm.get('stock')?.errors?.['required']">Stock is required</span>
                <span class="error-text" *ngIf="productForm.get('stock')?.touched && productForm.get('stock')?.errors?.['min']">Stock cannot be negative</span>
              </div>
            </div>

            <div class="form-group">
              <label for="category">Category *</label>
              <select id="category" formControlName="category" [class.error]="isFieldInvalid('category')">
                <option value="">Select Category</option>
                <option value="Lehengas">Lehengas</option>
                <option value="saree">saree</option>
                <option value="Gowns">Gowns</option>
                <option value="Kurtis">Kurtis</option>
              </select>
              <span class="error-text" *ngIf="productForm.get('category')?.touched && productForm.get('category')?.errors?.['required']">Category is required</span>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="form-section">
            <h3>Additional Information</h3>

            <div class="form-group">
              <label>Product Images</label>
              
              <!-- File Upload Section -->
              <div class="file-upload-area" 
                   (dragover)="onDragOver($event)" 
                   (dragleave)="onDragLeave($event)" 
                   (drop)="onDrop($event)"
                   [class.drag-over]="isDragging">
                <input 
                  type="file" 
                  id="images" 
                  (change)="onFileSelected($event)"
                  multiple
                  accept="image/*"
                  #fileInput
                >
                <div class="upload-content">
                  <span class="upload-icon">📁</span>
                  <p>Drag & drop images here or click to browse</p>
                  <small>Maximum 5 images, each up to 5MB</small>
                </div>
              </div>

              <!-- Selected Images Preview -->
              <div class="image-previews" *ngIf="selectedFiles.length > 0 || existingImages.length > 0">
                <!-- Existing Images -->
                <div class="preview-item" *ngFor="let img of existingImages; let i = index">
                  <img [src]="productService.getImageUrl(img)" alt="Product image">
                  <button type="button" class="remove-btn" (click)="removeExistingImage(i)">×</button>
                </div>
                <!-- New Selected Files -->
                <div class="preview-item" *ngFor="let file of selectedFiles; let i = index; trackBy: trackByFileIndex">
                  <img [src]="previewUrls[i]" alt="Product image">
                  <button type="button" class="remove-btn" (click)="removeSelectedFile(i)">×</button>
                </div>
              </div>
              <small>{{ selectedFiles.length }} file(s) selected</small>
            </div>

            <div class="form-group">
              <label>Sizes Available</label>
              <div class="checkbox-group">
                <label *ngFor="let size of availableSizes">
                  <input 
                    type="checkbox" 
                    [checked]="selectedSizes.includes(size)"
                    (change)="toggleSize(size)"
                  >
                  {{ size }}
                </label>
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="isFeatured">
                Mark as Featured Product
              </label>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="isNewArrival">
                Mark as New Arrival
              </label>
            </div>
          </div>
        </div>

        <div class="form-actions">
          @if (errorMessage) {
            <div class="error-banner">{{ errorMessage }}</div>
          }
          <button type="button" class="btn-cancel" routerLink="/admin/products">Cancel</button>
          <button 
            type="submit" 
            class="btn-submit"
            [disabled]="productForm.invalid || isLoading"
          >
            {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .product-form-container {
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .btn-back {
      background: #6c757d;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
    }

    .product-form {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    .form-section h3 {
      margin-top: 0;
      margin-bottom: 16px;
      color: #d63384;
      border-bottom: 2px solid #d63384;
      padding-bottom: 8px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #333;
    }

    .form-group input[type="text"],
    .form-group input[type="number"],
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #d63384;
    }

    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
      border-color: #dc3545;
    }

    .error-text {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
      display: block;
    }

    .form-group small {
      color: #666;
      font-size: 12px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: normal;
    }

    .checkbox-label {
      display: flex !important;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .checkbox-label input {
      width: auto !important;
    }

    .form-actions {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn-cancel {
      background: #6c757d;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-submit {
      background: #d63384;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-submit:hover:not(:disabled) {
      background: #c22572;
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-banner {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      padding: 10px 16px;
      border-radius: 4px;
      font-size: 14px;
      flex: 1;
    }

    /* File Upload Styles */
    .image-source-toggle {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
    }

    .image-source-toggle button {
      padding: 8px 16px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .image-source-toggle button.active {
      background: #d63384;
      color: white;
      border-color: #d63384;
    }

    .file-upload-area {
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .file-upload-area:hover {
      border-color: #d63384;
      background-color: #fdf5f8;
    }

    .file-upload-area.drag-over {
      border-color: #d63384;
      background-color: #fdf5f8;
    }

    .file-upload-area input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .upload-content {
      pointer-events: none;
    }

    .upload-icon {
      font-size: 32px;
      display: block;
      margin-bottom: 8px;
    }

    .upload-content p {
      margin: 0 0 4px 0;
      color: #333;
    }

    .upload-content small {
      color: #666;
    }

    .url-input-area {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
    }

    .url-input-area input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .btn-add-url {
      padding: 10px 20px;
      background: #d63384;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .image-previews {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 12px;
    }

    .preview-item {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid #ddd;
    }

    .preview-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .preview-item .remove-btn {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #dc3545;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  isLoading = false;
  errorMessage = '';
  availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
  selectedSizes: string[] = [];
  
  // File upload properties
  selectedFiles: File[] = [];
  existingImages: string[] = [];
  isDragging = false;
  previewUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    public productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {
    this.initForm();
    this.productId = this.route.snapshot.paramMap.get('id');
    
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct();
    }
  }

  initForm() {
    this.productForm = this.fb.group({
      name:        ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
      price:       ['', [Validators.required, Validators.min(1)]],
      category:    ['', Validators.required],
      stock:       ['', [Validators.required, Validators.min(0)]],
      isFeatured:  [false],
      isNewArrival:[false]
    });
  }

  loadProduct() {
    this.productService.getProduct(this.productId!).subscribe({
      next: (res) => {
        const product = res.data;
        this.selectedSizes = product.sizes || [];
        this.existingImages = product.images || [];
        
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          isFeatured: product.isFeatured,
          isNewArrival: product.isNewArrival
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.router.navigate(['/admin/products']);
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  toggleSize(size: string) {
    const index = this.selectedSizes.indexOf(size);
    if (index > -1) {
      this.selectedSizes.splice(index, 1);
    } else {
      this.selectedSizes.push(size);
    }
  }

  // File handling methods
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
      // Clear the input so the same file can be selected again
      input.value = '';
    }
  }

  handleFiles(files: File[]) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const maxFiles = 5 - (this.existingImages.length + this.selectedFiles.length);
    
    if (imageFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} more image(s)`);
      return;
    }
    
    // Check file size (5MB max per file)
    for (const file of imageFiles) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }
    }
    
    this.selectedFiles = [...this.selectedFiles, ...imageFiles];
    
    // Generate preview URLs
    for (const file of imageFiles) {
      const url = URL.createObjectURL(file);
      this.previewUrls.push(url);
    }
    this.cdr.detectChanges();
  }

  removeSelectedFile(index: number) {
    // Revoke preview URL to avoid memory leaks
    if (this.previewUrls[index]) {
      URL.revokeObjectURL(this.previewUrls[index]);
    }
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
    this.cdr.detectChanges();
  }

  removeExistingImage(index: number) {
    this.existingImages.splice(index, 1);
    this.cdr.detectChanges();
  }

  trackByFileIndex(index: number): number {
    return index;
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.errorMessage = 'Please fix the errors above before submitting.';
      return;
    }
    if (this.selectedSizes.length === 0) {
      this.errorMessage = 'Please select at least one size.';
      return;
    }

    this.isLoading = true;
    const formValue = this.productForm.value;

    const productData: Partial<Product> = {
      name: formValue.name,
      description: formValue.description,
      price: Number(formValue.price),
      category: formValue.category,
      images: this.existingImages,
      stock: Number(formValue.stock),
      sizes: this.selectedSizes,
      isFeatured: formValue.isFeatured,
      isNewArrival: formValue.isNewArrival
    };

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productData, this.selectedFiles).subscribe({
        next: () => {
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to update product. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.productService.createProduct(productData, this.selectedFiles).subscribe({
        next: () => {
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to create product. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
