# Implementation Notes

These notes map the implementation back to the Mermaid source-of-truth architecture.

## Storefront Layer

- `layout/theme.liquid` loads `assets/commerce-orchestrator.js` as the storefront-safe adapter.
- `snippets/product-card.liquid` exposes wishlist and dynamic-pricing hooks through `data-*` attributes.
- `sections/recommendation-engine.liquid` implements the `RecommendationEngine -> Liquid Recommendation Sections -> Visitor` path.
- `sections/review-system.liquid` implements the storefront side of `Reviews -> Reviews and Moderation`.
- `sections/return-request.liquid` implements the customer entry point for `Returns and Refunds`.
- `sections/order-tracking.liquid` implements the storefront side of `Shipping and Tracking -> Delivery Flow`.
- `sections/customer-dashboard.liquid` maps Shopify Customer Accounts to the customer-facing dashboard.
- `sections/admin-analytics-dashboard.liquid` is a storefront-safe dashboard surface for app-proxy analytics data; privileged Admin API work remains in the app layer.

## Service Layer

- `app/contracts/ecommerce.ts` defines domain contracts for Shopify app and app-proxy services.
- `app/services/commerce-services.ts` keeps pricing, discounts, recommendations, fraud, inventory, returns, notifications, event publishing, and audit logging isolated from Liquid.
- `app/api/routes.ts` defines integration points for public app proxy routes, admin app routes, webhooks, and worker queues.
- `app/database/schema.sql` defines auxiliary data storage for wishlists, analytics, recommendations, returns, reviews, inventory reservations, notifications, and audit logs.

## Architecture Rules Applied

- Theme code renders UI and calls storefront-safe endpoints only.
- Checkout, payments, fraud, inventory reservation, order orchestration, refunds, and Admin API flows remain service/app responsibilities.
- Merchant-configurable UI is implemented as Shopify sections and templates.
- Reusable UI primitives are implemented as snippets.
- Data relationships are documented in Mermaid and SQL, with Shopify remaining the commerce system of record.
