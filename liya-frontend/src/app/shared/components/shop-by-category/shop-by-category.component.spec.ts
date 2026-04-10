import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ShopByCategoryComponent, Category } from './shop-by-category.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <app-shop-by-category
      [categories]="testCategories"
      [activeCategory]="activeCat"
      (categorySelected)="onCategorySelected($event)"
    ></app-shop-by-category>
  `
})
class TestHostComponent {
  testCategories: Category[] = [
    { _id: '1', name: 'Sarees', image: '/images/sarees.jpg', productCount: 150, isPremium: true },
    { _id: '2', name: 'Lehengas', image: '/images/lehengas.jpg', productCount: 80 },
    { _id: '3', name: 'Gowns', image: '/images/gowns.jpg', productCount: 120, isPremium: true },
    { _id: '4', name: 'Anarkalis', image: '/images/anarkalis.jpg', productCount: 95 }
  ];
  activeCat = '';
  selectedCategory = '';

  onCategorySelected(categoryId: string) {
    this.selectedCategory = categoryId;
  }
}

describe('ShopByCategoryComponent', () => {
  let hostComponent: TestHostComponent;
  let component: ShopByCategoryComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  const mockCategories: Category[] = [
    { _id: '1', name: 'Sarees', image: '/images/sarees.jpg', productCount: 150, isPremium: true },
    { _id: '2', name: 'Lehengas', image: '/images/lehengas.jpg', productCount: 80 },
    { _id: '3', name: 'Gowns', image: '/images/gowns.jpg', productCount: 120, isPremium: true },
    { _id: '4', name: 'Anarkalis', image: '/images/anarkalis.jpg', productCount: 95 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [ShopByCategoryComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(ShopByCategoryComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive categories input', () => {
    expect(component.categories).toEqual(mockCategories);
  });

  it('should emit categorySelected when category is clicked', fakeAsync(() => {
    const emitSpy = spyOn(component.categorySelected, 'emit');
    
    const categoryCards = fixture.debugElement.queryAll(By.css('.category-card'));
    categoryCards[0].triggerEventHandler('click', {});
    tick();
    
    expect(emitSpy).toHaveBeenCalledWith('1');
  }));

  it('should update isHovered signal on mouse enter/leave', () => {
    const categoryCards = fixture.debugElement.queryAll(By.css('.category-card'));
    
    categoryCards[0].triggerEventHandler('mouseenter', {});
    expect(component.isHovered()).toBe('1');
    
    categoryCards[0].triggerEventHandler('mouseleave', {});
    expect(component.isHovered()).toBeNull();
  });

  it('should track categories by _id', () => {
    const trackedId = component.trackByCategoryId(0, mockCategories[0]);
    expect(trackedId).toBe('1');
  });

  it('should return correct image URL', () => {
    expect(component.getImageUrl('/uploads/cat.jpg')).toBe('http://localhost:3000/uploads/cat.jpg');
    expect(component.getImageUrl('http://example.com/img.jpg')).toBe('http://example.com/img.jpg');
  });

  it('should pause on hover', () => {
    const container = fixture.debugElement.query(By.css('.categories-container'));
    container.triggerEventHandler('mouseenter', {});
    expect(component.isPaused()).toBe(true);

    container.triggerEventHandler('mouseleave', {});
    expect(component.isPaused()).toBe(false);
  });

  it('should have ARIA labels on navigation arrows', () => {
    const prevArrow = fixture.debugElement.query(By.css('.nav-prev'));
    const nextArrow = fixture.debugElement.query(By.css('.nav-next'));
    
    expect(prevArrow.nativeElement.getAttribute('aria-label')).toBe('Previous categories');
    expect(nextArrow.nativeElement.getAttribute('aria-label')).toBe('Next categories');
  });

  it('should have ARIA labels on category cards', () => {
    const categoryCard = fixture.debugElement.query(By.css('.category-card'));
    expect(categoryCard.nativeElement.getAttribute('role')).toBe('button');
  });

  it('should show premium badge for premium categories', () => {
    const premiumBadge = fixture.debugElement.query(By.css('.premium-badge'));
    expect(premiumBadge).toBeTruthy();
  });
});
