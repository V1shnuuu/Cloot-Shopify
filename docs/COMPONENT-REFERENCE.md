# Premium UI Component Reference

Complete reference for all reusable components with detailed parameters and examples.

## Component Manifest

### 1. Button (`snippets/button.liquid`)
**Purpose**: Primary call-to-action across entire storefront

**Parameters**:
- `text` (string, required): Button text
- `url` (string, optional): Link destination
- `variant` (string): 'primary' | 'secondary' | 'outline' | 'ghost'
- `size` (string): 'sm' | 'md' | 'lg'
- `full_width` (boolean): Stretch to container width
- `disabled` (boolean): Disable button
- `class` (string): Additional CSS classes

**Examples**:
```liquid
{% render 'button', text: 'Shop Now', url: '/collections', variant: 'primary', size: 'lg' %}

{% render 'button', text: 'Learn More', variant: 'outline', full_width: true %}

{% render 'button', text: 'Delete', variant: 'error', disabled: true %}
```

---

### 2. Card (`snippets/card.liquid`)
**Purpose**: Versatile container for content with glassmorphism

**Parameters**:
- `title` (string, optional): Card headline
- `description` (string, optional): Card body text
- `image` (image, optional): Featured image
- `badge` (string, optional): Top-right label
- `hover_effect` (string): 'lift' | 'glow' | 'scale'
- `use_glass` (boolean): Apply glassmorphism
- `class` (string): Additional CSS classes

**Examples**:
```liquid
{% render 'card',
  title: 'Feature',
  description: 'Premium quality guaranteed',
  image: product.featured_image,
  badge: 'New',
  hover_effect: 'lift'
%}
```

---

### 3. Product Card (`snippets/product-card.liquid`)
**Purpose**: Product showcase with pricing, ratings, and actions

**Parameters**:
- `product` (product, required): Shopify product object
- `show_rating` (boolean): Display star ratings
- `show_badge` (boolean): Show sale/new badge
- `size` (string): 'sm' | 'md' | 'lg'

**Features**:
- Lazy-loaded images
- Hover zoom effect
- Quick-view and wishlist buttons
- Discount percentage badge
- Star ratings with review count
- Original & sale pricing

**Example**:
```liquid
{% for product in collection.products %}
  {% render 'product-card',
    product: product,
    show_rating: true,
    show_badge: true
  %}
{% endfor %}
```

---

### 4. Badge (`snippets/badge.liquid`)
**Purpose**: Status, tag, and label indicators

**Parameters**:
- `text` (string, required): Badge text
- `variant` (string): 'primary' | 'success' | 'warning' | 'error' | 'info'
- `size` (string): 'sm' | 'md' | 'lg'
- `icon` (string, optional): Emoji or icon text
- `class` (string): Additional CSS classes

**Examples**:
```liquid
{% render 'badge', text: 'In Stock', variant: 'success', icon: '✓' %}

{% render 'badge', text: 'Sale', variant: 'warning', size: 'lg' %}

{% render 'badge', text: 'Error', variant: 'error', size: 'sm' %}
```

---

### 5. Modal (`snippets/modal.liquid`)
**Purpose**: Overlay dialog for forms, previews, confirmations

**Parameters**:
- `id` (string, required): Unique identifier
- `title` (string): Modal headline
- `fullscreen_mobile` (boolean): Full viewport on mobile
- `class` (string): Additional CSS classes

**Opening Modal**:
```javascript
document.getElementById('modal-id').classList.add('active');
```

**Example**:
```liquid
{% render 'modal',
  id: 'quick-view',
  title: 'Quick View',
  fullscreen_mobile: true
%}

<script>
  document.querySelector('.quick-view-btn').addEventListener('click', () => {
    document.getElementById('quick-view').classList.add('active');
  });
</script>
```

---

### 6. Drawer (`snippets/drawer.liquid`)
**Purpose**: Side panel for navigation, filters, cart

**Parameters**:
- `id` (string, required): Unique identifier
- `title` (string): Drawer heading
- `position` (string): 'left' | 'right'
- `class` (string): Additional CSS classes

**Opening Drawer**:
```javascript
openDrawer('drawer-id');
closeDrawer('drawer-id');
```

---

### 7. Pricing Card (`snippets/pricing-card.liquid`)
**Purpose**: Pricing tier display for plans/products

**Parameters**:
- `name` (string): Plan name
- `price` (string): Display price (number only)
- `description` (string): Plan description
- `features` (array): List of feature strings
- `cta_text` (string): Button text
- `cta_url` (string): Button link
- `featured` (boolean): Highlight as popular tier
- `class` (string): Additional CSS classes

**Example**:
```liquid
{% render 'pricing-card',
  name: 'Professional',
  price: '99',
  description: 'For growing teams',
  features: [
    'Unlimited projects',
    'Advanced analytics',
    'Priority support'
  ],
  cta_text: 'Get Started',
  cta_url: '/checkout',
  featured: true
%}
```

---

## Section Manifest

### 1. Hero Premium (`sections/hero-premium.liquid`)
**Parameters**:
- `title` (string): Main headline
- `subtitle` (string, optional): Supporting text
- `image` (image, optional): Background image
- `cta_text` (string): Button text
- `cta_url` (string): Button destination
- `overlay_color` (string): Overlay intensity
- `alignment` (string): 'left' | 'center' | 'right'

---

### 2. Features Grid (`sections/features-grid.liquid`)
**Parameters**:
- `title` (string, optional): Section heading
- `description` (string, optional): Intro text
- `features` (array): Feature objects with icon, title, description
- `layout` (string): 'two-col' | 'three-col' | 'four-col'

---

### 3. Products Grid (`sections/products-grid.liquid`)
**Parameters**:
- `title` (string, optional): Section heading
- `collection` (collection): Shopify collection object
- `products_per_page` (number): Items to display
- `layout` (string): Grid column count
- `show_filters` (boolean): Enable filter sidebar
- `show_sort` (boolean): Enable sort dropdown

---

### 4. Recommendations Carousel (`sections/recommendations-carousel.liquid`)
**Parameters**:
- `title` (string, optional): Section heading
- `recommendation_type` (string): 'trending' | 'personalized' | 'related' | 'new-arrivals'
- `product_count` (number): Products to display

---

### 5. Testimonials (`sections/testimonials.liquid`)
**Parameters**:
- `title` (string, optional): Section heading
- `description` (string, optional): Intro text
- `testimonials` (array): Review objects with name, title, content, rating

---

### 6. CTA Premium (`sections/cta-premium.liquid`)
**Parameters**:
- `title` (string): Main headline
- `description` (string, optional): Supporting text
- `primary_cta_text` (string): First button
- `primary_cta_url` (string): First button link
- `secondary_cta_text` (string, optional): Second button
- `secondary_cta_url` (string, optional): Second button link
- `background_image` (image, optional): Background
- `layout` (string): 'centered' | 'left' | 'right'

---

### 7. Admin Analytics (`sections/admin-analytics.liquid`)
Dashboard with KPIs, charts, and order table

---

### 8. Admin Inventory (`sections/admin-inventory.liquid`)
Inventory management with stock levels and reorder controls

---

### 9. FAQ (`sections/faq.liquid`)
Collapsible accordion with search

---

### 10. Footer Premium (`sections/footer-premium.liquid`)
Multi-column footer with newsletter and social links

---

## Global CSS Variables

All customizable via theme editor:

```css
:root {
  /* Colors */
  --color-primary-500: #0ea5e9;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* Spacing */
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  
  /* Typography */
  --font-size-base: 1rem;
  --font-weight-semibold: 600;
  
  /* Border Radius */
  --radius-lg: 0.75rem;
  --radius-2xl: 1.5rem;
  
  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Integration Patterns

### Adding Product Grid to Homepage
```json
{
  "type": "products-grid",
  "settings": {
    "title": "Featured Products",
    "layout": "three-col",
    "show_filters": true,
    "show_sort": true
  }
}
```

### Using Components in Sections
```liquid
{% section 'hero-premium' %}

{% for product in collection.products %}
  {% render 'product-card', product: product %}
{% endfor %}

{% section 'testimonials' %}
```

### Custom Component Styling
```liquid
{% render 'button',
  text: 'Custom Style',
  variant: 'primary',
  class: 'custom-class'
%}
```

---

## Performance Tips

1. **Lazy Load Images**: Use `loading="lazy"` attribute
2. **Skeleton States**: Show placeholders during load
3. **Debounce Events**: Avoid excessive re-renders
4. **Critical CSS**: Inline above-fold styles
5. **Asset Optimization**: Minify CSS/JS, optimize images

---

## Accessibility Checklist

- [ ] All images have alt text
- [ ] Links have descriptive anchor text
- [ ] Buttons have visible focus states
- [ ] Color contrast ≥ 4.5:1
- [ ] Keyboard navigation works
- [ ] ARIA labels on complex components
- [ ] Form fields properly labeled
- [ ] Error messages clear and actionable

---

## Common Use Cases

### Homepage Layout
1. Hero Section
2. Features Grid
3. Product Grid
4. Testimonials
5. CTA Section
6. FAQ

### Product Page
1. Product Gallery
2. Product Details
3. Variants/Options
4. Add to Cart
5. Related Products
6. Reviews

### Admin Dashboard
1. Analytics KPIs
2. Sales Charts
3. Recent Orders
4. Inventory Status
5. Customer Insights

---

## Troubleshooting

**Component not rendering?**
- Check Liquid syntax
- Verify all required parameters
- Check browser console for JS errors

**Styles not applying?**
- Clear browser cache
- Check CSS specificity
- Verify CSS variables are set

**Performance issues?**
- Reduce image sizes
- Implement lazy loading
- Debounce event listeners
- Use CSS transforms for animations

---

**Created for production-grade e-commerce experiences**
