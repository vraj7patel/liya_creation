# Requirements: Mobile Responsive UI

## Introduction

This document defines the functional and non-functional requirements for making the Liya Creation Angular 17 e-commerce frontend fully responsive and mobile-friendly. Requirements are derived from the design document and the user's stated goals.

---

## Requirements

### Requirement 1: Mobile Header Navigation

**User Story**: As a mobile user, I want a hamburger menu button in the header so I can access navigation links without a cluttered desktop nav bar.

#### Acceptance Criteria

1.1 The hamburger/menu button MUST be visible on viewports ≤ 992px wide.

1.2 The desktop navigation bar (Home, All Products, Lehengas, Saree, Gowns, Kurtis) MUST be hidden on viewports ≤ 992px wide.

1.3 At any viewport width, the desktop nav and hamburger button MUST NOT both be hidden simultaneously (mutual exclusivity).

1.4 Tapping the hamburger button MUST open a slide-in drawer from the left side of the screen.

1.5 The mobile drawer MUST contain navigation links: Home, All Products, Categories section (Lehengas, Saree, Gowns, Kurtis), Wishlist, Cart, and Login/Sign Up (or account links when logged in).

1.6 Tapping any navigation link in the drawer MUST close the drawer and navigate to the correct route.

1.7 Tapping the overlay behind the drawer MUST close the drawer.

1.8 The drawer MUST display a close (×) button that closes the drawer when tapped.

1.9 When the drawer is open, the body MUST NOT scroll behind the overlay.

---

### Requirement 2: Responsive Product Cards

**User Story**: As a mobile user, I want product cards to display clearly on small screens so I can browse and purchase products comfortably.

#### Acceptance Criteria

2.1 Product card images MUST maintain a 4:5 aspect ratio at all viewport widths.

2.2 The product name MUST be clamped to a maximum of 2 lines on all screen sizes to prevent card height inconsistency.

2.3 The "Add to Cart" and "Buy Now" action buttons MUST stack vertically (full-width) on viewports ≤ 576px.

2.4 Size selector buttons MUST wrap to the next line rather than overflow the card on narrow viewports.

2.5 The wishlist button MUST have a minimum touch target of 44×44px on all devices.

2.6 All interactive elements on the card (buttons, links) MUST have a minimum touch target of 44×44px.

---

### Requirement 3: Responsive Product Grid

**User Story**: As a user on any device, I want the product grid to adapt its column count so products are displayed at a readable size.

#### Acceptance Criteria

3.1 On the Home page, the product grid MUST display:
- 4 columns at ≥ 1201px
- 3 columns at 993px–1200px
- 2 columns at 381px–992px
- 1 column at ≤ 380px

3.2 On the Product List page, the product grid MUST display:
- 3 columns at ≥ 1201px
- 2 columns at 577px–1200px
- 1 column at ≤ 576px

3.3 Grid column count MUST decrease monotonically as viewport width decreases (never increase as width decreases).

3.4 All cards within a grid row MUST have equal height (CSS Grid stretch alignment).

---

### Requirement 4: Product Detail Page Mobile Layout

**User Story**: As a mobile user, I want the product detail page to stack the image gallery above the product info so I can view them without horizontal scrolling.

#### Acceptance Criteria

4.1 On viewports ≤ 768px, the product layout MUST switch from a 2-column side-by-side grid to a single-column stacked layout (image above info).

4.2 On viewports ≤ 576px, the "Add to Cart" and "Buy Now" buttons on the product detail page MUST be full-width and stacked vertically.

4.3 The related products grid on the product detail page MUST display 2 columns at ≤ 576px and 1 column at ≤ 380px.

4.4 The trust badges section MUST remain in a 2-column grid on mobile (≤ 576px) with reduced padding.

4.5 The breadcrumb navigation MUST wrap to multiple lines rather than overflow horizontally on small screens.

---

### Requirement 5: Fixed Header Offset

**User Story**: As a user on any device, I want page content to start below the fixed header so no content is hidden behind it.

#### Acceptance Criteria

5.1 The `<main>` element's `padding-top` MUST be at least equal to the combined height of the announcement strip and the header at every breakpoint.

5.2 On viewports > 576px, `padding-top` MUST be at least 116px (36px strip + 80px header).

5.3 On viewports ≤ 576px, `padding-top` MUST be at least 92px (28px strip + 64px header).

5.4 The announcement strip height MUST reduce to 28px on viewports ≤ 576px to save vertical space.

---

### Requirement 6: All-Device Friendly UI

**User Story**: As a user on any device (phone, tablet, laptop, desktop), I want the entire website to be usable without horizontal scrolling or broken layouts.

#### Acceptance Criteria

6.1 No page MUST produce horizontal overflow (scrollbar) on any viewport width ≥ 320px.

6.2 All text MUST remain readable (minimum 14px rendered size) on viewports ≥ 320px.

6.3 The footer MUST display in a 4-column grid at ≥ 993px, 2-column at 577px–992px, and 1-column at ≤ 576px.

6.4 The category cards horizontal scroll track on the Home page MUST be scrollable by touch/swipe on mobile.

6.5 All form inputs (login, register, checkout, filters) MUST have a minimum font-size of 16px on mobile to prevent iOS auto-zoom.

6.6 The site MUST be usable with touch-only input (no hover-dependent functionality required for core actions).

6.7 Safe area insets (notched phones) MUST be respected using `env(safe-area-inset-*)` on the container padding.
