# Commerce App Service Layer

This folder contains implementation-ready service contracts for backend capabilities that must not live inside Shopify Liquid theme code.

The Shopify theme owns storefront rendering and browser interaction. These services are designed for a Shopify app, app proxy, webhook worker, or external commerce service that integrates with Shopify Admin API, Storefront API, webhooks, and payment or shipping providers.

## Architecture Mapping

- `contracts/ecommerce.ts`: shared domain contracts for products, carts, orders, inventory, returns, analytics, notifications, and events.
- `services/commerce-services.ts`: isolated service interfaces and default orchestration classes.
- `api/routes.ts`: API and app-proxy route contracts for storefront, admin, webhook, and worker integrations.
- `database/schema.sql`: scalable relational schema for non-Shopify auxiliary data such as wishlists, analytics events, recommendations, support cases, returns, audit logs, and notification outbox records.

Do not import these files directly into Liquid. Theme JavaScript should call app-proxy or public storefront-safe endpoints only.
