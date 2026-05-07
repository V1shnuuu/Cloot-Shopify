# Project Architecture

This directory is the source of truth for AI-assisted development in this Shopify e-commerce theme. Codex, Cursor, Claude Code, Cline, Roo Code, Antigravity, Copilot, and future agents should read this file before changing code and should update the relevant Mermaid diagrams whenever storefront flows, services, data relationships, integrations, or Shopify theme structure changes.

## Architecture Files

- [ecommerce-system.mmd](./ecommerce-system.mmd): complete storefront, commerce, service, and operations system map.
- [checkout-flow.mmd](./checkout-flow.mmd): cart, discount, checkout, payment, fraud, order, and notification flow.
- [admin-flow.mmd](./admin-flow.mmd): Shopify Admin, theme editor, app, moderation, support, and analytics flow.
- [inventory-flow.mmd](./inventory-flow.mmd): inventory reservation, warehouse processing, shipment, delivery, and restock flow.
- [recommendation-flow.mmd](./recommendation-flow.mmd): analytics, personalization, recommendation, and dynamic pricing flow.
- [returns-flow.mmd](./returns-flow.mmd): returns, refunds, support, inventory recovery, and moderation flow.
- [frontend-flow.mmd](./frontend-flow.mmd): storefront rendering flow.
- [backend-flow.mmd](./backend-flow.mmd): Shopify service and app boundary flow.
- [database-design.mmd](./database-design.mmd): core Shopify commerce data relationships.
- [implementation-notes.md](./implementation-notes.md): implementation map from Mermaid flows to code modules.

## Complete E-Commerce System

```mermaid
flowchart TB
  Customer["Customer"]
  AdminUser["Merchant or Admin"]
  SupportAgent["Support Agent"]

  subgraph Edge["Edge, CDN, and Cache Layer"]
    CDN["Shopify CDN"]
    BrowserCache["Browser Cache"]
    AssetCache["Asset Cache"]
  end

  subgraph Storefront["Shopify Theme Storefront"]
    Layout["layout/theme.liquid"]
    Templates["templates"]
    Sections["sections"]
    Snippets["snippets"]
    Assets["assets"]
    Collections["Collection Pages"]
    ProductPages["Product Pages"]
    Wishlist["Wishlist UI"]
    Cart["Cart Drawer and Cart Page"]
    Search["Predictive Search"]
    ReviewsWidget["Reviews UI"]
  end

  subgraph Commerce["Commerce Services"]
    Auth["Authentication Service"]
    Catalog["Catalog Service"]
    CartService["Cart Service"]
    DiscountEngine["Discount Engine"]
    Checkout["Checkout Service"]
    Shipping["Shipping Selection"]
    Payment["Payment Gateway"]
    Fraud["Fraud Detection"]
    Orders["Order Creation"]
    Inventory["Inventory Reservation"]
  end

  subgraph Operations["Operations and Fulfillment"]
    Warehouse["Warehouse Processing"]
    Tracking["Shipping and Tracking"]
    Delivery["Delivery Flow"]
    Returns["Returns and Refunds"]
    Support["Customer Support"]
    Moderation["Reviews and Moderation"]
  end

  subgraph Intelligence["Data and Intelligence"]
    Analytics["Analytics Engine"]
    Recommendations["Recommendation Engine"]
    DynamicPricing["Dynamic Pricing"]
    Notifications["Notification System"]
    Events["Event Queue or Message Broker"]
  end

  subgraph Admin["Admin and Integrations"]
    ShopifyAdmin["Shopify Admin Dashboard"]
    ThemeEditor["Theme Editor"]
    AppIntegrations["App Integrations"]
    AdminApi["Admin API"]
    StorefrontApi["Storefront API"]
    Webhooks["Webhooks"]
  end

  subgraph Data["Database and Shopify Data"]
    Products[("Products")]
    Variants[("Variants")]
    CollectionsDb[("Collections")]
    Customers[("Customers")]
    OrdersDb[("Orders")]
    InventoryDb[("Inventory Levels")]
    Metafields[("Metafields and Metaobjects")]
    ReviewsDb[("Reviews")]
    EventsDb[("Events")]
  end

  Customer --> CDN
  CDN --> BrowserCache
  CDN --> Layout
  Layout --> Templates
  Templates --> Sections
  Sections --> Snippets
  Snippets --> Assets
  Sections --> Collections
  Sections --> ProductPages
  Sections --> Wishlist
  Sections --> Cart
  Layout --> Search
  ProductPages --> ReviewsWidget

  Collections --> Catalog
  ProductPages --> Catalog
  Search --> Catalog
  Wishlist --> Auth
  Wishlist --> Catalog
  Cart --> CartService
  CartService --> DiscountEngine
  DiscountEngine --> Checkout
  Checkout --> Shipping
  Checkout --> Payment
  Payment --> Fraud
  Fraud --> Orders
  Orders --> Inventory
  Inventory --> Warehouse
  Warehouse --> Tracking
  Tracking --> Delivery

  Customer --> Auth
  Auth --> Customers
  Catalog --> Products
  Catalog --> Variants
  Catalog --> CollectionsDb
  Catalog --> Metafields
  Orders --> OrdersDb
  Inventory --> InventoryDb
  ReviewsWidget --> Moderation
  Moderation --> ReviewsDb

  Orders --> Events
  Inventory --> Events
  Delivery --> Events
  Returns --> Events
  Events --> Notifications
  Events --> Analytics
  Events --> EventsDb
  Analytics --> Recommendations
  Analytics --> DynamicPricing
  Recommendations --> ProductPages
  DynamicPricing --> Catalog
  Notifications --> Customer

  Customer --> Support
  SupportAgent --> Support
  Delivery --> Returns
  Returns --> Payment
  Returns --> Inventory
  Returns --> Support

  AdminUser --> ShopifyAdmin
  ShopifyAdmin --> ThemeEditor
  ThemeEditor --> Layout
  ShopifyAdmin --> AdminApi
  ShopifyAdmin --> AppIntegrations
  AppIntegrations --> StorefrontApi
  AppIntegrations --> AdminApi
  AdminApi --> Products
  AdminApi --> CollectionsDb
  AdminApi --> Metafields
  AdminApi --> OrdersDb
  AdminApi --> InventoryDb
  Webhooks --> AppIntegrations
  Orders --> Webhooks
  Inventory --> Webhooks
  AppIntegrations --> ReviewsDb
  AppIntegrations --> Analytics
```

## Frontend, Backend, and Service Relationships

The storefront is a Shopify Liquid theme. It renders through `layout/theme.liquid`, page templates, sections, snippets, and assets. Frontend behavior should remain focused on rendering, interaction, progressive enhancement, cart UI, search UI, product discovery, and theme-editor-configurable components.

The backend is mostly Shopify-managed. Product catalogs, collections, variants, customer accounts, cart state, checkout, orders, payments, shipping, and metafields are platform services. Custom backend behavior belongs in isolated Shopify apps, app proxies, webhooks, message queues, or external services.

The API layer connects the two worlds. Liquid objects provide server-rendered commerce data. Ajax Cart API powers cart updates. Predictive Search API powers search. Storefront API may power client-side read flows. Admin API must be used only by authenticated backend apps and never exposed in theme JavaScript.

## Shopify Structure Mapping

```mermaid
flowchart TD
  Theme["Shopify Theme Root"]
  LayoutDir["layout"]
  TemplatesDir["templates"]
  SectionsDir["sections"]
  SnippetsDir["snippets"]
  AssetsDir["assets"]
  ConfigDir["config"]
  BlocksDir["blocks"]
  LocalesDir["locales"]

  LayoutDir --> ThemeShell["theme.liquid shell"]
  TemplatesDir --> PageComposition["JSON page composition"]
  SectionsDir --> StorefrontModules["Configurable storefront modules"]
  SnippetsDir --> ReusableFragments["Reusable Liquid fragments"]
  AssetsDir --> StaticResources["CSS, JavaScript, images, fonts"]
  ConfigDir --> ThemeSettings["Theme settings and merchant data"]
  BlocksDir --> NestedComponents["Reusable nested theme components"]
  LocalesDir --> Translations["Translation keys"]

  Theme --> LayoutDir
  Theme --> TemplatesDir
  Theme --> SectionsDir
  Theme --> SnippetsDir
  Theme --> AssetsDir
  Theme --> ConfigDir
  Theme --> BlocksDir
  Theme --> LocalesDir

  PageComposition --> StorefrontModules
  StorefrontModules --> ReusableFragments
  ReusableFragments --> StaticResources
  ThemeSettings --> StorefrontModules
  NestedComponents --> StorefrontModules
  Translations --> StorefrontModules
```

## Scalable Liquid Component Hierarchy

Use this hierarchy when adding or refactoring storefront features:

```mermaid
flowchart TD
  Layout["layout/theme.liquid"]
  GlobalSnippets["Global snippets: meta, fonts, core CSS, motion, cart, search"]
  Template["Template JSON or Liquid"]
  Section["Section: page-level configurable module"]
  Block["Block: nested configurable component"]
  Snippet["Snippet: reusable rendering primitive"]
  Asset["Asset: shared static file"]
  ShopifyData["Shopify data: products, collections, cart, customer, metafields"]

  Layout --> GlobalSnippets
  Layout --> Template
  Template --> Section
  Section --> Block
  Section --> Snippet
  Block --> Snippet
  Snippet --> Asset
  ShopifyData --> Layout
  ShopifyData --> Template
  ShopifyData --> Section
  ShopifyData --> Snippet
```

## Database Relationships

Shopify owns the operational database. Theme code should render these objects instead of re-creating commerce state in custom JavaScript.

```mermaid
erDiagram
  SHOP ||--o{ PRODUCT : owns
  SHOP ||--o{ COLLECTION : owns
  SHOP ||--o{ CUSTOMER : owns
  SHOP ||--o{ ORDER : owns
  SHOP ||--o{ DISCOUNT : configures
  SHOP ||--o{ METAOBJECT : owns
  PRODUCT ||--o{ VARIANT : has
  PRODUCT }o--o{ COLLECTION : appears_in
  PRODUCT ||--o{ MEDIA : has
  PRODUCT ||--o{ METAFIELD : described_by
  VARIANT ||--o{ INVENTORY_LEVEL : stocked_as
  VARIANT ||--o{ CART_LINE : selected_as
  VARIANT ||--o{ ORDER_LINE : purchased_as
  CUSTOMER ||--o{ WISHLIST_ITEM : saves
  CUSTOMER ||--o{ ORDER : places
  CUSTOMER ||--o{ REVIEW : writes
  ORDER ||--o{ ORDER_LINE : contains
  ORDER ||--o{ FULFILLMENT : fulfilled_by
  ORDER ||--o{ RETURN_REQUEST : may_have
  RETURN_REQUEST ||--o{ REFUND : produces
  COLLECTION ||--o{ METAFIELD : described_by
  METAOBJECT ||--o{ METAFIELD : contains
  REVIEW ||--o{ MODERATION_EVENT : reviewed_by
  EVENT ||--o{ NOTIFICATION : triggers
  EVENT ||--o{ ANALYTICS_RECORD : records

  SHOP {
    string id
    string name
    string primary_domain
  }
  PRODUCT {
    string id
    string handle
    string title
    string status
  }
  VARIANT {
    string id
    string sku
    decimal price
    int inventory_quantity
  }
  ORDER {
    string id
    string name
    string financial_status
    string fulfillment_status
  }
  METAFIELD {
    string namespace
    string key
    string type
    string owner_id
  }
```

## Development Rules for AI Agents

- Read this file and the relevant `.mmd` file before generating code.
- Follow the Mermaid diagrams strictly unless the user explicitly requests an architecture change.
- Keep Shopify Liquid rendering modular through sections, snippets, templates, blocks, assets, layout, config, and locales.
- Reuse snippets and components before creating new ones.
- Keep business logic isolated from presentation: storefront code should not become an order, pricing, inventory, or admin service.
- Preserve existing naming conventions and theme editor configurability.
- Update Mermaid docs whenever frontend flow, checkout flow, inventory flow, recommendations, returns, analytics, integrations, or data relationships change.

## Implemented Module Map

| Architecture flow | Theme or app module |
| --- | --- |
| Storefront to wishlist | `snippets/product-card.liquid`, `assets/commerce-orchestrator.js`, `app/api/routes.ts` |
| Storefront to cart and checkout | `snippets/cart-drawer.liquid`, `sections/cart.liquid`, Shopify Ajax Cart API, Shopify Checkout |
| Storefront to recommendations | `sections/recommendation-engine.liquid`, `assets/commerce-orchestrator.js`, `app/services/commerce-services.ts` |
| Storefront to dynamic pricing | `snippets/product-card.liquid`, `assets/commerce-orchestrator.js`, `app/services/commerce-services.ts` |
| Reviews and moderation | `sections/review-system.liquid`, `app/database/schema.sql`, `app/api/routes.ts` |
| Returns and refunds | `sections/return-request.liquid`, `app/services/commerce-services.ts`, `app/database/schema.sql` |
| Shipping and tracking | `sections/order-tracking.liquid`, `app/api/routes.ts` |
| Customer authentication dashboard | `sections/customer-dashboard.liquid`, Shopify Customer Accounts |
| Admin analytics dashboard | `sections/admin-analytics-dashboard.liquid`, `app/api/routes.ts`, Shopify Admin app boundary |
| Event queue and notifications | `assets/commerce-orchestrator.js`, `app/api/routes.ts`, `app/services/commerce-services.ts` |
