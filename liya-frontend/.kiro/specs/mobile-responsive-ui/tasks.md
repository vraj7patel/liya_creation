# Tasks: Mobile Responsive UI

## Task List

- [x] 1 Fix header hamburger breakpoint alignment
  - [x] 1.1 Change the hamburger toggle button visibility so it shows at ≤ 992px (matching when the desktop nav hides) instead of the current ≤ 1200px `.hide-desktop` class
  - [x] 1.2 Verify the desktop nav `.hide-mobile` breakpoint is 768px and adjust to 992px so nav and hamburger are mutually exclusive at the same breakpoint
  - [x] 1.3 Add `overflow: hidden` to `body` when `mobileMenuOpen = true` and remove it on close to prevent background scroll

- [x] 2 Fix main content padding-top for fixed header offset
  - [x] 2.1 Update `app.component.ts` styles: set `main { padding-top: 116px }` (36px strip + 80px header)
  - [x] 2.2 Add mobile override: `@media (max-width: 576px) { main { padding-top: 92px } }` (28px strip + 64px header)
  - [x] 2.3 Reduce announcement strip height to 28px on ≤ 576px in `header.component.ts`

- [x] 3 Fix ProductDetailComponent mobile layout
  - [x] 3.1 Add `@media (max-width: 768px)` rule to `.product-layout` to switch to single-column stacked layout
  - [x] 3.2 Add `@media (max-width: 576px)` rules: full-width stacked action buttons, reduced padding
  - [x] 3.3 Add responsive rules for `.related-grid`: 2 columns at ≤ 576px, 1 column at ≤ 380px
  - [x] 3.4 Ensure breadcrumb wraps with `flex-wrap: wrap` (already set — verify)

- [x] 4 Improve product card mobile display
  - [x] 4.1 Add `-webkit-line-clamp: 2` to `.product-name` in `premium-product-card.component.scss` to prevent card height inconsistency
  - [x] 4.2 Verify action buttons stack vertically at ≤ 576px (already in SCSS — confirm and fix if needed)
  - [x] 4.3 Verify size selector buttons wrap correctly on narrow cards (check `flex-wrap: wrap` on `.sizes`)

- [x] 5 Verify and fix product grid column counts
  - [x] 5.1 Confirm Home page grid breakpoints match spec: 4→3→2→1 columns at 1200/992/380px
  - [x] 5.2 Confirm Product List page grid breakpoints match spec: 3→2→1 columns at 1200/576px
  - [x] 5.3 Ensure grid `gap` reduces on mobile (use `var(--spacing-md)` at ≤ 576px)

- [x] 6 Global mobile polish
  - [x] 6.1 Verify `body { overflow-x: hidden }` is present in `styles.scss` (already set — confirm)
  - [x] 6.2 Verify all form inputs have `font-size: 16px` on mobile in `styles.scss` (already set — confirm)
  - [x] 6.3 Verify `env(safe-area-inset-*)` is applied to `.container` padding in `styles.scss` (already set — confirm)
  - [x] 6.4 Verify category card horizontal scroll track is touch-scrollable (`overflow-x: auto`, `-webkit-overflow-scrolling: touch`) in `home.component.ts`
