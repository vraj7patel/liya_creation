import { a as U } from "./chunk-CY3XELEK.js";
import { a as R } from "./chunk-2IFWVMZ5.js";
import { a as j } from "./chunk-P5J6DLKM.js";
import { a as Q } from "./chunk-6FZOYZWU.js";
import {
  b as Y,
  d as H,
  g as G,
  i as J,
  p as K,
  q as X,
  t as Z,
} from "./chunk-A6XTZJO4.js";
import { a as A } from "./chunk-LHA52PHF.js";
import { c as N, e as W, f as $ } from "./chunk-M577JEDA.js";
import "./chunk-GDRDB33M.js";
import {
  Na as _,
  Pa as g,
  Q as h,
  Qa as x,
  Sa as p,
  Ta as T,
  Ua as E,
  V as k,
  Va as O,
  Vb as B,
  Wa as b,
  Xa as n,
  Xb as L,
  Ya as i,
  Za as l,
  ab as y,
  ba as m,
  bb as C,
  ca as u,
  cb as c,
  db as I,
  ib as r,
  jb as v,
  kb as f,
  nb as D,
  ob as V,
  pb as q,
  rb as F,
  sa as M,
  tb as w,
  ub as S,
  vb as z,
  xa as o,
} from "./chunk-6U7FXZY6.js";
import "./chunk-TMC7WMLO.js";
var tt = (e, s) => s._id,
  et = (e) => ["/products/category", e],
  nt = (e) => ["/products", e];
function it(e, s) {
  e & 1 && (n(0, "div", 1), r(1, "Loading product..."), i());
}
function ot(e, s) {
  if ((e & 1 && l(0, "img", 12), e & 2)) {
    let t = c(2);
    g(
      "src",
      t.productService.getImageUrl(t.product.images[t.selectedImageIndex]),
      M,
    )("alt", t.product.name);
  }
}
function rt(e, s) {
  if ((e & 1 && l(0, "img", 46), e & 2)) {
    let t = c(2);
    g("alt", t.product.name);
  }
}
function at(e, s) {
  e & 1 && (n(0, "div", 13), r(1, "Sold Out"), i());
}
function ct(e, s) {
  if (e & 1) {
    let t = y();
    (n(0, "button", 48),
      C("click", function () {
        let a = m(t).$index,
          P = c(3);
        return u((P.selectedImageIndex = a));
      }),
      l(1, "img", 12),
      i());
  }
  if (e & 2) {
    let t = s.$implicit,
      d = s.$index,
      a = c(3);
    (x("active", a.selectedImageIndex === d),
      o(),
      g("src", a.productService.getImageUrl(t), M)("alt", a.product.name));
  }
}
function st(e, s) {
  if (
    (e & 1 && (n(0, "div", 18), O(1, ct, 2, 4, "button", 47, T), i()), e & 2)
  ) {
    let t = c(2);
    (o(), b(t.product.images));
  }
}
function dt(e, s) {
  if (e & 1) {
    let t = y();
    (n(0, "button", 51),
      C("click", function () {
        let a = m(t).$implicit,
          P = c(3);
        return u((P.selectedSize = a));
      }),
      r(1),
      i());
  }
  if (e & 2) {
    let t = s.$implicit,
      d = c(3);
    (x("active", d.selectedSize === t), o(), f(" ", t, " "));
  }
}
function lt(e, s) {
  if (
    (e & 1 &&
      (n(0, "div", 25)(1, "h3"),
      r(2, "Select Size"),
      i(),
      n(3, "div", 49),
      O(4, dt, 2, 3, "button", 50, E),
      i()()),
    e & 2)
  ) {
    let t = c(2);
    (o(4), b(t.product.sizes));
  }
}
function gt(e, s) {
  if ((e & 1 && (n(0, "p", 32), l(1, "i", 52), r(2), i()), e & 2)) {
    let t = c(2);
    (o(2), f(" ", t.product.stock, " items in stock"));
  }
}
function pt(e, s) {
  e & 1 && (n(0, "p", 53), l(1, "i", 54), r(2, " Out of stock"), i());
}
function mt(e, s) {
  if ((e & 1 && (n(0, "div", 38), l(1, "i", 52), r(2), i()), e & 2)) {
    let t = c(2);
    (o(2), f(" ", t.successMessage, " "));
  }
}
function ut(e, s) {
  if ((e & 1 && (n(0, "div", 39), l(1, "i", 55), r(2), i()), e & 2)) {
    let t = c(2);
    (o(2), f(" ", t.errorMessage, " "));
  }
}
function _t(e, s) {
  if ((e & 1 && l(0, "img", 12), e & 2)) {
    let t = c().$implicit,
      d = c(3);
    g("src", d.productService.getImageUrl(t.images[0]), M)("alt", t.name);
  }
}
function Ct(e, s) {
  if ((e & 1 && l(0, "img", 60), e & 2)) {
    let t = c().$implicit;
    g("alt", t.name);
  }
}
function ft(e, s) {
  if (
    (e & 1 &&
      (n(0, "div", 57)(1, "a", 8)(2, "div", 58),
      _(3, _t, 1, 2, "img", 12)(4, Ct, 1, 1),
      i(),
      n(5, "div", 59)(6, "h4"),
      r(7),
      i(),
      n(8, "span", 23),
      r(9),
      S(10, "number"),
      i()()()()),
    e & 2)
  ) {
    let t = s.$implicit;
    (o(),
      g("routerLink", w(6, nt, t._id)),
      o(2),
      p(3, t.images && t.images.length > 0 ? 3 : 4),
      o(4),
      v(t.name),
      o(2),
      f("\u20B9", z(10, 4, t.price), ""));
  }
}
function ht(e, s) {
  if (
    (e & 1 &&
      (n(0, "section", 45)(1, "h2"),
      r(2, "You May Also Like"),
      i(),
      n(3, "div", 56),
      O(4, ft, 11, 8, "div", 57, tt),
      i()()),
    e & 2)
  ) {
    let t = c(2);
    (o(4), b(t.relatedProducts));
  }
}
function vt(e, s) {
  if (e & 1) {
    let t = y();
    (n(0, "div", 2)(1, "div", 3)(2, "nav", 4)(3, "a", 5),
      r(4, "Home"),
      i(),
      l(5, "i", 6),
      n(6, "a", 7),
      r(7, "Products"),
      i(),
      l(8, "i", 6),
      n(9, "a", 8),
      r(10),
      i(),
      l(11, "i", 6),
      n(12, "span"),
      r(13),
      i()()()(),
      n(14, "div", 3)(15, "div", 9)(16, "div", 10)(17, "div", 11),
      _(18, ot, 1, 2, "img", 12)(19, rt, 1, 1)(20, at, 2, 0, "div", 13),
      n(21, "button", 14),
      C("click", function () {
        m(t);
        let a = c();
        return u(a.toggleWishlist());
      }),
      l(22, "i", 15),
      i(),
      n(23, "button", 16),
      C("click", function () {
        m(t);
        let a = c();
        return u(a.shareProduct());
      }),
      l(24, "i", 17),
      i()(),
      _(25, st, 3, 0, "div", 18),
      i(),
      n(26, "div", 19)(27, "div", 20)(28, "span", 21),
      r(29),
      i(),
      n(30, "h1"),
      r(31),
      i()(),
      n(32, "div", 22)(33, "span", 23),
      r(34),
      S(35, "number"),
      i()(),
      n(36, "div", 24)(37, "h3"),
      r(38, "Description"),
      i(),
      n(39, "p"),
      r(40),
      i()(),
      _(41, lt, 6, 0, "div", 25),
      n(42, "div", 26)(43, "h3"),
      r(44, "Quantity"),
      i(),
      n(45, "div", 27)(46, "button", 28),
      C("click", function () {
        m(t);
        let a = c();
        return u(a.decreaseQuantity());
      }),
      l(47, "i", 29),
      i(),
      n(48, "input", 30),
      q("ngModelChange", function (a) {
        m(t);
        let P = c();
        return (V(P.quantity, a) || (P.quantity = a), u(a));
      }),
      i(),
      n(49, "button", 28),
      C("click", function () {
        m(t);
        let a = c();
        return u(a.increaseQuantity());
      }),
      l(50, "i", 31),
      i()(),
      _(51, gt, 3, 1, "p", 32)(52, pt, 3, 0),
      i(),
      n(53, "div", 33)(54, "button", 34),
      C("click", function () {
        m(t);
        let a = c();
        return u(a.addToCart());
      }),
      l(55, "i", 35),
      r(56),
      i(),
      n(57, "button", 36),
      C("click", function () {
        m(t);
        let a = c();
        return u(a.buyNow());
      }),
      l(58, "i", 37),
      r(59),
      i()(),
      _(60, mt, 3, 1, "div", 38)(61, ut, 3, 1, "div", 39),
      n(62, "div", 40)(63, "div", 41),
      l(64, "i", 42),
      n(65, "span"),
      r(66, "Free shipping on orders above \u20B91,999"),
      i()(),
      n(67, "div", 41),
      l(68, "i", 43),
      n(69, "span"),
      r(70, "30-day easy returns"),
      i()(),
      n(71, "div", 41),
      l(72, "i", 44),
      n(73, "span"),
      r(74, "Secure checkout"),
      i()()()()(),
      _(75, ht, 6, 0, "section", 45),
      i());
  }
  if (e & 2) {
    let t = c();
    (o(9),
      g("routerLink", w(30, et, t.product.category)),
      o(),
      v(t.product.category),
      o(3),
      v(t.product.name),
      o(5),
      p(18, t.product.images.length > 0 ? 18 : 19),
      o(2),
      p(20, t.product.stock === 0 ? 20 : -1),
      o(),
      x("in-wishlist", t.isInWishlist()),
      I("title", t.isInWishlist() ? "Remove from wishlist" : "Add to wishlist"),
      o(),
      x("fa-heart", t.isInWishlist())("fa-heart-o", !t.isInWishlist()),
      o(3),
      p(25, t.product.images.length > 1 ? 25 : -1),
      o(4),
      v(t.product.category),
      o(2),
      v(t.product.name),
      o(3),
      f("\u20B9", z(35, 28, t.product.price), ""),
      o(6),
      v(t.product.description),
      o(),
      p(41, t.product.sizes.length > 0 ? 41 : -1),
      o(7),
      D("ngModel", t.quantity),
      g("max", t.product.stock),
      o(3),
      p(51, t.product.stock > 0 ? 51 : 52),
      o(3),
      g("disabled", t.product.stock === 0 || t.addingToCart),
      o(2),
      f(" ", t.addingToCart ? "Adding..." : "Add to Cart", " "),
      o(),
      g("disabled", t.product.stock === 0 || t.processingBuyNow),
      o(2),
      f(" ", t.processingBuyNow ? "Processing..." : "Buy Now", " "),
      o(),
      p(60, t.successMessage ? 60 : -1),
      o(),
      p(61, t.errorMessage ? 61 : -1),
      o(14),
      p(75, t.relatedProducts.length > 0 ? 75 : -1));
  }
}
function Pt(e, s) {
  e & 1 &&
    (n(0, "div", 3)(1, "div", 61),
    l(2, "i", 62),
    n(3, "h2"),
    r(4, "Product not found"),
    i(),
    n(5, "p"),
    r(6, "The product you're looking for doesn't exist or has been removed."),
    i(),
    n(7, "a", 63),
    r(8, "Back to Products"),
    i()()());
}
var Vt = (() => {
  class e {
    constructor() {
      ((this.productService = h(U)),
        (this.wishlistService = h(R)),
        (this.cartService = h(j)),
        (this.authService = h(A)),
        (this.orderService = h(Q)),
        (this.router = h(W)),
        (this.route = h(N)),
        (this.relatedProducts = []),
        (this.loading = !0),
        (this.selectedImageIndex = 0),
        (this.selectedSize = ""),
        (this.quantity = 1),
        (this.successMessage = ""),
        (this.errorMessage = ""),
        (this.addingToCart = !1),
        (this.processingBuyNow = !1));
    }
    ngOnInit() {
      this.route.params.subscribe((t) => {
        t.id && this.loadProduct(t.id);
      });
    }
    loadProduct(t) {
      ((this.loading = !0),
        this.productService.getProduct(t).subscribe({
          next: (d) => {
            ((this.product = d.data),
              this.product &&
                ((this.product.images = this.product.images || []),
                (this.product.sizes = this.product.sizes || [])),
              this.product?.sizes &&
                this.product.sizes.length > 0 &&
                (this.selectedSize = this.product.sizes[0]),
              (this.loading = !1),
              this.loadRelatedProducts());
          },
          error: () => {
            this.loading = !1;
          },
        }));
    }
    loadRelatedProducts() {
      this.product &&
        this.productService
          .getProducts({ category: this.product.category, limit: 4 })
          .subscribe({
            next: (t) => {
              this.relatedProducts = (t.data || []).filter(
                (d) => d._id !== this.product?._id,
              );
            },
            error: () => {},
          });
    }
    increaseQuantity() {
      this.product && this.quantity < this.product.stock && this.quantity++;
    }
    decreaseQuantity() {
      this.quantity > 1 && this.quantity--;
    }
    isInWishlist() {
      return this.product
        ? this.wishlistService.isInWishlist(this.product._id)
        : !1;
    }
    addToCart() {
      if (this.product) {
        if (!this.authService.isLoggedIn()) {
          this.router.navigate(["/auth/login"]);
          return;
        }
        if (!this.selectedSize && this.product.sizes.length > 0) {
          ((this.errorMessage = "Please select a size"),
            setTimeout(() => (this.errorMessage = ""), 3e3));
          return;
        }
        ((this.addingToCart = !0),
          (this.errorMessage = ""),
          this.cartService
            .addToCart(
              this.product,
              this.quantity,
              this.selectedSize || "Free Size",
            )
            .subscribe({
              next: (t) => {
                (t.success
                  ? ((this.successMessage =
                      "Product added to cart successfully!"),
                    setTimeout(() => {
                      this.successMessage = "";
                    }, 3e3))
                  : ((this.errorMessage = t.message || "Failed to add to cart"),
                    setTimeout(() => (this.errorMessage = ""), 3e3)),
                  (this.addingToCart = !1));
              },
              error: (t) => {
                (console.error("Error adding to cart:", t),
                  (this.errorMessage =
                    "Failed to add to cart. Please try again."),
                  setTimeout(() => (this.errorMessage = ""), 3e3),
                  (this.addingToCart = !1));
              },
            }));
      }
    }
    buyNow() {
      if (this.product) {
        if (!this.authService.isLoggedIn()) {
          this.router.navigate(["/auth/login"]);
          return;
        }
        if (!this.selectedSize && this.product.sizes.length > 0) {
          ((this.errorMessage = "Please select a size"),
            setTimeout(() => (this.errorMessage = ""), 3e3));
          return;
        }
        ((this.processingBuyNow = !0),
          (this.errorMessage = ""),
          this.orderService
            .buyNow({
              productId: this.product._id,
              quantity: this.quantity,
              size: this.selectedSize || "Free Size",
            })
            .subscribe({
              next: (t) => {
                (t.success
                  ? this.router.navigate(["/checkout"], {
                      queryParams: { orderId: t.data.orderId },
                    })
                  : ((this.errorMessage =
                      t.message || "Failed to process order"),
                    setTimeout(() => (this.errorMessage = ""), 3e3)),
                  (this.processingBuyNow = !1));
              },
              error: (t) => {
                (console.error("Error processing buy now:", t),
                  (this.errorMessage =
                    "Failed to process order. Please try again."),
                  setTimeout(() => (this.errorMessage = ""), 3e3),
                  (this.processingBuyNow = !1));
              },
            }));
      }
    }
    toggleWishlist() {
      if (this.product) {
        if (!this.authService.isLoggedIn()) {
          this.router.navigate(["/auth/login"]);
          return;
        }
        this.wishlistService.toggleWishlist(this.product._id).subscribe({
          next: () => {},
          error: (t) => {
            console.error("Error toggling wishlist:", t);
          },
        });
      }
    }
    shareProduct() {
      navigator.share && this.product
        ? navigator
            .share({
              title: this.product.name,
              text: `Check out ${this.product.name} at Liya Creation`,
              url: window.location.href,
            })
            .catch(() => {})
        : this.product &&
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
              alert("Link copied to clipboard!");
            })
            .catch(() => {});
    }
    static {
      this.ɵfac = function (d) {
        return new (d || e)();
      };
    }
    static {
      this.ɵcmp = k({
        type: e,
        selectors: [["app-product-detail"]],
        standalone: !0,
        features: [F],
        decls: 4,
        vars: 1,
        consts: [
          [1, "product-detail-page"],
          [1, "loading"],
          [1, "product-breadcrumb"],
          [1, "container"],
          [1, "breadcrumb"],
          ["routerLink", "/"],
          [1, "fas", "fa-chevron-right"],
          ["routerLink", "/products"],
          [3, "routerLink"],
          [1, "product-layout"],
          [1, "product-images"],
          [1, "main-image"],
          [3, "src", "alt"],
          [1, "stock-badge", "sold-out"],
          [1, "wishlist-btn", 3, "click", "title"],
          [1, "fas"],
          ["title", "Share product", 1, "share-btn", 3, "click"],
          [1, "fas", "fa-share-alt"],
          [1, "thumbnail-list"],
          [1, "product-info"],
          [1, "product-header"],
          [1, "product-category"],
          [1, "price-section"],
          [1, "price"],
          [1, "description"],
          [1, "size-section"],
          [1, "quantity-section"],
          [1, "quantity-selector"],
          [3, "click"],
          [1, "fas", "fa-minus"],
          ["type", "number", "min", "1", 3, "ngModelChange", "ngModel", "max"],
          [1, "fas", "fa-plus"],
          [1, "stock-info"],
          [1, "action-buttons"],
          [1, "btn", "btn-primary", "btn-lg", 3, "click", "disabled"],
          [1, "fas", "fa-shopping-bag"],
          [1, "btn", "btn-secondary", "btn-lg", 3, "click", "disabled"],
          [1, "fas", "fa-bolt"],
          [1, "alert", "alert-success"],
          [1, "alert", "alert-error"],
          [1, "product-meta"],
          [1, "meta-item"],
          [1, "fas", "fa-shipping-fast"],
          [1, "fas", "fa-undo"],
          [1, "fas", "fa-lock"],
          [1, "related-products"],
          [
            "src",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop",
            3,
            "alt",
          ],
          [1, "thumbnail", 3, "active"],
          [1, "thumbnail", 3, "click"],
          [1, "size-options"],
          [1, "size-btn", 3, "active"],
          [1, "size-btn", 3, "click"],
          [1, "fas", "fa-check-circle"],
          [1, "out-of-stock"],
          [1, "fas", "fa-times-circle"],
          [1, "fas", "fa-exclamation-circle"],
          [1, "related-grid"],
          [1, "related-card"],
          [1, "related-image"],
          [1, "related-info"],
          [
            "src",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop",
            3,
            "alt",
          ],
          [1, "not-found"],
          [1, "fas", "fa-search"],
          ["routerLink", "/products", 1, "btn", "btn-primary"],
        ],
        template: function (d, a) {
          (d & 1 &&
            (n(0, "div", 0),
            _(1, it, 2, 0, "div", 1)(2, vt, 76, 32)(3, Pt, 9, 0),
            i()),
            d & 2 && (o(), p(1, a.loading ? 1 : a.product ? 2 : 3)));
        },
        dependencies: [L, B, $, Z, Y, J, H, X, K, G],
        styles: [
          ".product-detail-page[_ngcontent-%COMP%]{min-height:100vh;background:var(--color-bg)}.product-breadcrumb[_ngcontent-%COMP%]{background:var(--color-bg-light);padding:var(--spacing-lg) 0;border-bottom:1px solid var(--color-border-light)}.breadcrumb[_ngcontent-%COMP%]{display:flex;align-items:center;gap:var(--spacing-md);font-size:var(--font-size-sm);color:var(--color-text-muted);flex-wrap:wrap}.breadcrumb[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:var(--color-text-light);text-decoration:none;transition:color var(--transition-fast)}.breadcrumb[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:var(--color-primary)}.breadcrumb[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:.65rem;color:var(--color-text-muted)}.breadcrumb[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--color-text)}.product-layout[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-3xl);padding:var(--spacing-2xl) 0 var(--spacing-4xl)}.product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]{position:relative;border-radius:var(--radius-xl);overflow:hidden;background:var(--color-bg-light);margin-bottom:var(--spacing-lg)}.product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:auto;max-height:700px;object-fit:cover}.product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .stock-badge[_ngcontent-%COMP%]{position:absolute;top:var(--spacing-lg);left:var(--spacing-lg);padding:var(--spacing-sm) var(--spacing-lg);border-radius:var(--radius-md);font-size:var(--font-size-xs);font-weight:var(--font-weight-semibold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide)}.product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .stock-badge.sold-out[_ngcontent-%COMP%]{background:var(--color-text);color:#fff}.product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .wishlist-btn[_ngcontent-%COMP%], .product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .share-btn[_ngcontent-%COMP%]{position:absolute;width:48px;height:48px;border-radius:50%;background:#fff;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-lg);transition:all var(--transition-smooth);z-index:10}.product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .wishlist-btn[_ngcontent-%COMP%]{top:var(--spacing-lg);right:var(--spacing-lg)}.product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .share-btn[_ngcontent-%COMP%]{top:var(--spacing-lg);right:calc(var(--spacing-lg) + 56px)}.product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .wishlist-btn[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], .product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .share-btn[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:1.25rem;color:var(--color-text);transition:all var(--transition-smooth)}.product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .wishlist-btn[_ngcontent-%COMP%]:hover, .product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .share-btn[_ngcontent-%COMP%]:hover{background:var(--color-primary);transform:scale(1.1)}.product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .wishlist-btn[_ngcontent-%COMP%]:hover   i[_ngcontent-%COMP%], .product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .share-btn[_ngcontent-%COMP%]:hover   i[_ngcontent-%COMP%]{color:#fff}.product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .wishlist-btn.in-wishlist[_ngcontent-%COMP%]{background:var(--color-primary)}.product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .wishlist-btn.in-wishlist[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{color:#fff}.product-images[_ngcontent-%COMP%]   .thumbnail-list[_ngcontent-%COMP%]{display:flex;gap:var(--spacing-md);flex-wrap:wrap}.product-images[_ngcontent-%COMP%]   .thumbnail-list[_ngcontent-%COMP%]   .thumbnail[_ngcontent-%COMP%]{width:80px;height:100px;border:2px solid transparent;border-radius:var(--radius-md);overflow:hidden;cursor:pointer;padding:0;background:none;transition:all var(--transition-smooth)}.product-images[_ngcontent-%COMP%]   .thumbnail-list[_ngcontent-%COMP%]   .thumbnail.active[_ngcontent-%COMP%]{border-color:var(--color-secondary);box-shadow:var(--shadow-glow)}.product-images[_ngcontent-%COMP%]   .thumbnail-list[_ngcontent-%COMP%]   .thumbnail[_ngcontent-%COMP%]:hover{border-color:var(--color-secondary)}.product-images[_ngcontent-%COMP%]   .thumbnail-list[_ngcontent-%COMP%]   .thumbnail[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;object-fit:cover}.product-info[_ngcontent-%COMP%]   .product-header[_ngcontent-%COMP%]{margin-bottom:var(--spacing-xl)}.product-info[_ngcontent-%COMP%]   .product-header[_ngcontent-%COMP%]   .product-category[_ngcontent-%COMP%]{display:inline-block;font-size:var(--font-size-xs);color:var(--color-secondary);text-transform:uppercase;letter-spacing:var(--letter-spacing-widest);margin-bottom:var(--spacing-sm)}.product-info[_ngcontent-%COMP%]   .product-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-family:var(--font-heading);font-size:var(--font-size-4xl);color:var(--color-text);line-height:1.2}.product-info[_ngcontent-%COMP%]   .price-section[_ngcontent-%COMP%]{margin-bottom:var(--spacing-xl);padding-bottom:var(--spacing-xl);border-bottom:1px solid var(--color-border-light)}.product-info[_ngcontent-%COMP%]   .price-section[_ngcontent-%COMP%]   .price[_ngcontent-%COMP%]{font-family:var(--font-heading);font-size:var(--font-size-4xl);font-weight:var(--font-weight-bold);color:var(--color-primary)}.product-info[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]{margin-bottom:var(--spacing-xl)}.product-info[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-family:var(--font-heading);font-size:var(--font-size-lg);color:var(--color-text);margin-bottom:var(--spacing-md);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide)}.product-info[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--color-text-light);line-height:1.8;margin:0}.product-info[_ngcontent-%COMP%]   .size-section[_ngcontent-%COMP%], .product-info[_ngcontent-%COMP%]   .quantity-section[_ngcontent-%COMP%]{margin-bottom:var(--spacing-xl)}.product-info[_ngcontent-%COMP%]   .size-section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], .product-info[_ngcontent-%COMP%]   .quantity-section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-family:var(--font-heading);font-size:var(--font-size-base);color:var(--color-text);margin-bottom:var(--spacing-md);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide)}.product-info[_ngcontent-%COMP%]   .size-options[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:var(--spacing-md)}.product-info[_ngcontent-%COMP%]   .size-options[_ngcontent-%COMP%]   .size-btn[_ngcontent-%COMP%]{min-width:60px;padding:var(--spacing-md) var(--spacing-lg);border:2px solid var(--color-border);background:#fff;border-radius:var(--radius-md);font-size:var(--font-size-sm);font-weight:var(--font-weight-medium);cursor:pointer;transition:all var(--transition-smooth)}.product-info[_ngcontent-%COMP%]   .size-options[_ngcontent-%COMP%]   .size-btn[_ngcontent-%COMP%]:hover{border-color:var(--color-secondary);color:var(--color-secondary)}.product-info[_ngcontent-%COMP%]   .size-options[_ngcontent-%COMP%]   .size-btn.active[_ngcontent-%COMP%]{border-color:var(--color-secondary);background:linear-gradient(135deg,var(--color-secondary),var(--color-secondary-dark));color:#fff;box-shadow:var(--shadow-glow)}.product-info[_ngcontent-%COMP%]   .quantity-selector[_ngcontent-%COMP%]{display:flex;align-items:center;gap:var(--spacing-md)}.product-info[_ngcontent-%COMP%]   .quantity-selector[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:44px;height:44px;border:2px solid var(--color-border);background:#fff;border-radius:var(--radius-md);cursor:pointer;font-size:var(--font-size-sm);color:var(--color-text);transition:all var(--transition-smooth)}.product-info[_ngcontent-%COMP%]   .quantity-selector[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{border-color:var(--color-secondary);color:var(--color-secondary)}.product-info[_ngcontent-%COMP%]   .quantity-selector[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:70px;height:44px;text-align:center;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:var(--font-size-base);font-weight:var(--font-weight-medium)}.product-info[_ngcontent-%COMP%]   .quantity-selector[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{outline:none;border-color:var(--color-secondary)}.product-info[_ngcontent-%COMP%]   .stock-info[_ngcontent-%COMP%]{margin-top:var(--spacing-md);font-size:var(--font-size-sm);color:var(--color-success)}.product-info[_ngcontent-%COMP%]   .stock-info[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{margin-right:var(--spacing-sm)}.product-info[_ngcontent-%COMP%]   .out-of-stock[_ngcontent-%COMP%]{margin-top:var(--spacing-md);font-size:var(--font-size-sm);color:var(--color-error)}.product-info[_ngcontent-%COMP%]   .out-of-stock[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{margin-right:var(--spacing-sm)}.product-info[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%]{display:flex;gap:var(--spacing-lg);margin-bottom:var(--spacing-xl)}.product-info[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]{flex:1;justify-content:center;gap:var(--spacing-sm)}.product-info[_ngcontent-%COMP%]   .alert[_ngcontent-%COMP%]{display:flex;align-items:center;gap:var(--spacing-md)}.product-info[_ngcontent-%COMP%]   .alert-success[_ngcontent-%COMP%]{background:#d4edda;color:#155724;padding:var(--spacing-md);border-radius:var(--radius-md);margin-bottom:var(--spacing-lg)}.product-info[_ngcontent-%COMP%]   .alert-error[_ngcontent-%COMP%]{background:#f8d7da;color:#721c24;padding:var(--spacing-md);border-radius:var(--radius-md);margin-bottom:var(--spacing-lg)}.product-meta[_ngcontent-%COMP%]{margin-top:var(--spacing-xl);padding-top:var(--spacing-xl);border-top:1px solid var(--color-border-light)}.product-meta[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%]{display:flex;align-items:center;gap:var(--spacing-md);margin-bottom:var(--spacing-md);font-size:var(--font-size-sm);color:var(--color-text-light)}.product-meta[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{width:24px;color:var(--color-secondary)}.related-products[_ngcontent-%COMP%]{padding:var(--spacing-3xl) 0;border-top:1px solid var(--color-border-light)}.related-products[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-family:var(--font-heading);font-size:var(--font-size-3xl);text-align:center;margin-bottom:var(--spacing-2xl)}.related-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--spacing-xl)}.related-card[_ngcontent-%COMP%]{background:var(--color-bg-light);border-radius:var(--radius-lg);overflow:hidden;transition:all var(--transition-smooth)}.related-card[_ngcontent-%COMP%]:hover{transform:translateY(-8px);box-shadow:var(--shadow-xl)}.related-card[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none;display:block}.related-card[_ngcontent-%COMP%]   .related-image[_ngcontent-%COMP%]{aspect-ratio:3/4;overflow:hidden}.related-card[_ngcontent-%COMP%]   .related-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;object-fit:cover;transition:transform var(--transition-slow)}.related-card[_ngcontent-%COMP%]:hover   .related-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{transform:scale(1.05)}.related-card[_ngcontent-%COMP%]   .related-info[_ngcontent-%COMP%]{padding:var(--spacing-lg);text-align:center}.related-card[_ngcontent-%COMP%]   .related-info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-family:var(--font-heading);font-size:var(--font-size-base);color:var(--color-text);margin-bottom:var(--spacing-xs)}.related-card[_ngcontent-%COMP%]   .related-info[_ngcontent-%COMP%]   .price[_ngcontent-%COMP%]{font-family:var(--font-heading);font-size:var(--font-size-lg);color:var(--color-primary);font-weight:var(--font-weight-bold)}.not-found[_ngcontent-%COMP%]{text-align:center;padding:var(--spacing-4xl)}.not-found[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:4rem;color:var(--color-text-muted);margin-bottom:var(--spacing-xl)}.not-found[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-family:var(--font-heading);font-size:var(--font-size-3xl);margin-bottom:var(--spacing-md)}.not-found[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--color-text-light);margin-bottom:var(--spacing-xl)}@media (max-width: 992px){.product-layout[_ngcontent-%COMP%]{grid-template-columns:1fr;gap:var(--spacing-xl)}.product-info[_ngcontent-%COMP%]   .product-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:var(--font-size-3xl)}.related-grid[_ngcontent-%COMP%]{grid-template-columns:repeat(2,1fr)}}@media (max-width: 576px){.action-buttons[_ngcontent-%COMP%]{flex-direction:column}.related-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}.product-images[_ngcontent-%COMP%]   .main-image[_ngcontent-%COMP%]   .share-btn[_ngcontent-%COMP%]{right:var(--spacing-lg);top:calc(var(--spacing-lg) + 56px)}}",
        ],
      });
    }
  }
  return e;
})();
export { Vt as ProductDetailComponent };
