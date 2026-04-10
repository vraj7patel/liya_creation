import { 
  Component, 
  Input, 
  Output, 
  EventEmitter,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// ============================================================================
// Types
// ============================================================================

export interface Category {
  _id: string;
  name: string;
  image: string;
  productCount: number;
  isPremium?: boolean;
}

// ============================================================================
// Component
// ============================================================================

@Component({
  selector: 'app-shop-by-category',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shop-by-category.component.html',
  styleUrls: ['./shop-by-category.component.scss']
})
export class ShopByCategoryComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;
  
  // Inputs
  @Input() categories: Category[] = [];
  @Input() activeCategory: string = '';
  
  // Outputs
  @Output() categorySelected = new EventEmitter<string>();

  // Signals
  readonly isHovered = signal<string | null>(null);
  readonly isPaused = signal(false);
  readonly isLoading = signal(true);
  
  // Auto-play interval
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  private readonly AUTO_PLAY_DELAY = 3000;
  private readonly SCROLL_AMOUNT = 280;

  // Computed
  readonly visibleCategories = computed(() => this.categories);

  // ============================================================================
  // Lifecycle
  // ============================================================================

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngAfterViewInit(): void {
    // Add keyboard navigation
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', this.handleKeydown.bind(this));
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    if (typeof window !== 'undefined') {
      document.removeEventListener('keydown', this.handleKeydown.bind(this));
    }
  }

  // ============================================================================
  // Auto-play Methods
  // ============================================================================

  private startAutoPlay(): void {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      if (!this.isPaused()) {
        this.scrollNext();
      }
    }, this.AUTO_PLAY_DELAY);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  // ============================================================================
  // Scroll Methods
  // ============================================================================

  scrollNext(): void {
    const container = this.scrollContainer?.nativeElement;
    if (!container) return;

    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;
    const nextScroll = currentScroll + this.SCROLL_AMOUNT;

    if (nextScroll >= maxScroll) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollTo({ left: nextScroll, behavior: 'smooth' });
    }
  }

  scrollPrev(): void {
    const container = this.scrollContainer?.nativeElement;
    if (!container) return;

    const currentScroll = container.scrollLeft;
    const prevScroll = currentScroll - this.SCROLL_AMOUNT;

    if (prevScroll <= 0) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    } else {
      container.scrollTo({ left: prevScroll, behavior: 'smooth' });
    }
  }

  // ============================================================================
  // Event Handlers
  // ============================================================================

  onMouseEnter(categoryId: string): void {
    this.isHovered.set(categoryId);
    this.isPaused.set(true);
  }

  onMouseLeave(): void {
    this.isHovered.set(null);
    this.isPaused.set(false);
  }

  onCategoryClick(category: Category): void {
    this.categorySelected.emit(category._id);
  }

  onCategoryKeydown(event: KeyboardEvent, category: Category): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.categorySelected.emit(category._id);
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.scrollPrev();
    } else if (event.key === 'ArrowRight') {
      this.scrollNext();
    }
  }

  // TrackBy for ngFor
  trackByCategoryId(index: number, category: Category): string {
    return category._id;
  }

  // Helper to get full image URL - uses relative path for proxy
  getImageUrl(imagePath: string): string {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=Category';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Use relative path for proxy
    if (!imagePath.startsWith('/')) {
      return '/' + imagePath;
    }
    return imagePath;
  }

  // Get description for each category
  getCategoryDescription(categoryName: string): string {
    const descriptions: { [key: string]: string } = {
      'Lehengas': 'Exquisite craftsmanship for your special day',
      'saree': 'Timeless elegance with modern silhouettes',
      'Gowns': 'Graceful silhouettes for grand occasions',
      'Kurtis': 'Effortless sophistication for everyday luxury',
      'Sarees': 'The epitome of Indian tradition',
      'Dupattas': 'Add charm to any ensemble'
    };
    return descriptions[categoryName] || 'Discover our premium collection';
  }
}
