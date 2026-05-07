(() => {
  const CONFIG = {
    endpoints: {
      events: '/apps/Cloot/events',
      wishlist: '/apps/Cloot/wishlist',
      recommendations: '/apps/Cloot/recommendations',
      pricing: '/apps/Cloot/pricing',
      returns: '/apps/Cloot/returns',
      reviews: '/apps/Cloot/reviews',
      tracking: '/apps/Cloot/tracking'
    },
    storage: {
      anonymousId: 'tlm_anonymous_id',
      wishlist: 'tlm_wishlist',
      eventQueue: 'tlm_event_queue',
      viewed: 'tlm_recently_viewed'
    }
  };

  const jsonHeaders = { 'Content-Type': 'application/json', Accept: 'application/json' };

  const createId = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

  const readJson = (key, fallback) => {
    try {
      return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (error) {
      return fallback;
    }
  };

  const writeJson = (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      return false;
    }
    return true;
  };

  const getAnonymousId = () => {
    const existing = window.localStorage.getItem(CONFIG.storage.anonymousId);
    if (existing) {
      return existing;
    }
    const next = createId('anon');
    window.localStorage.setItem(CONFIG.storage.anonymousId, next);
    return next;
  };

  class EventQueue {
    constructor() {
      this.memoryQueue = [];
      this.isFlushing = false;
    }

    enqueue(topic, payload = {}) {
      const event = {
        topic,
        anonymousId: getAnonymousId(),
        sessionId: window.Shopify?.analytics?.meta?.page?.customerId ? `customer_${window.Shopify.analytics.meta.page.customerId}` : undefined,
        payload,
        occurredAt: new Date().toISOString()
      };
      const stored = readJson(CONFIG.storage.eventQueue, []);
      stored.push(event);
      if (!writeJson(CONFIG.storage.eventQueue, stored.slice(-50))) {
        this.memoryQueue.push(event);
      }
      this.flush();
    }

    async flush() {
      if (this.isFlushing) {
        return;
      }
      this.isFlushing = true;
      const stored = readJson(CONFIG.storage.eventQueue, []);
      const events = [...stored, ...this.memoryQueue].slice(0, 20);
      if (!events.length) {
        this.isFlushing = false;
        return;
      }
      try {
        const response = await fetch(CONFIG.endpoints.events, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({ events })
        });
        if (response.ok) {
          writeJson(CONFIG.storage.eventQueue, stored.slice(events.length));
          this.memoryQueue = [];
        }
      } catch (error) {
        // App proxy may not be installed yet. Events remain queued locally.
      } finally {
        this.isFlushing = false;
      }
    }
  }

  class WishlistService {
    constructor(events) {
      this.events = events;
      this.items = readJson(CONFIG.storage.wishlist, []);
    }

    has(productId) {
      return this.items.some((item) => item.productId === productId);
    }

    set(product) {
      if (!product.productId) {
        return;
      }
      if (this.has(product.productId)) {
        this.items = this.items.filter((item) => item.productId !== product.productId);
      } else {
        this.items = [{ ...product, addedAt: new Date().toISOString() }, ...this.items].slice(0, 100);
      }
      writeJson(CONFIG.storage.wishlist, this.items);
      this.sync(product);
      this.events.enqueue('storefront.wishlist_updated', { productId: product.productId, active: this.has(product.productId) });
      document.dispatchEvent(new CustomEvent('tlm:wishlist:changed', { detail: { items: this.items } }));
    }

    async sync(product) {
      try {
        await fetch(CONFIG.endpoints.wishlist, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({ anonymousId: getAnonymousId(), product })
        });
      } catch (error) {
        // Local wishlist remains the source of truth until app proxy sync is available.
      }
    }
  }

  class RecommendationService {
    constructor(events) {
      this.events = events;
    }

    hydrate() {
      document.querySelectorAll('[data-recommendation-shelf]').forEach((shelf) => {
        const strategy = shelf.dataset.recommendationStrategy || 'recently_viewed';
        if (strategy === 'recently_viewed') {
          this.renderRecentlyViewed(shelf);
        }
        this.events.enqueue('storefront.product_viewed', {
          strategy,
          productId: shelf.dataset.currentProductId || null,
          collectionId: shelf.dataset.collectionId || null
        });
      });
    }

    renderRecentlyViewed(shelf) {
      const mount = shelf.querySelector('[data-recommendation-results]');
      if (!mount) {
        return;
      }
      const currentUrl = shelf.dataset.currentProductUrl || '';
      const items = readJson(CONFIG.storage.viewed, [])
        .filter((item) => item.url !== currentUrl)
        .slice(0, Number(shelf.dataset.limit || 4));
      if (!items.length) {
        shelf.hidden = true;
        return;
      }
      mount.innerHTML = items
        .map((item) => `
          <a class="tlm-recommendation-card" href="${item.url}">
            <span class="tlm-recommendation-card__media"><img src="${item.image}" alt="${item.title}" loading="lazy"></span>
            <span>${item.title}</span>
            <small>${item.price}</small>
          </a>
        `)
        .join('');
    }
  }

  class FormWorkflowService {
    constructor(events) {
      this.events = events;
    }

    bindReturnForms() {
      document.querySelectorAll('[data-return-request-form]').forEach((form) => {
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          await this.submitWorkflow(form, CONFIG.endpoints.returns, 'return.requested');
        });
      });
    }

    bindReviewForms() {
      document.querySelectorAll('[data-review-form]').forEach((form) => {
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          await this.submitWorkflow(form, CONFIG.endpoints.reviews, 'review.submitted');
        });
      });
    }

    bindTrackingForms() {
      document.querySelectorAll('[data-tracking-form]').forEach((form) => {
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          await this.submitWorkflow(form, CONFIG.endpoints.tracking, 'storefront.search_submitted');
        });
      });
    }

    async submitWorkflow(form, endpoint, topic) {
      const status = form.querySelector('[data-workflow-status]');
      const payload = Object.fromEntries(new FormData(form).entries());
      if (status) {
        status.textContent = 'Submitting...';
      }
      this.events.enqueue(topic, payload);
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({ anonymousId: getAnonymousId(), payload })
        });
        if (!response.ok) {
          throw new Error('Workflow endpoint unavailable');
        }
        if (status) {
          status.textContent = 'Received. We will update you shortly.';
        }
        form.reset();
      } catch (error) {
        if (status) {
          status.textContent = 'Saved locally. The service endpoint will sync when connected.';
        }
      }
    }
  }

  class DynamicPricingService {
    constructor(events) {
      this.events = events;
    }

    async hydrate() {
      const nodes = [...document.querySelectorAll('[data-dynamic-price]')];
      if (!nodes.length) {
        return;
      }
      const variants = nodes.map((node) => ({
        productId: node.dataset.productId,
        variantId: node.dataset.variantId
      }));
      this.events.enqueue('storefront.product_viewed', { dynamicPricingVariants: variants });
      try {
        const response = await fetch(CONFIG.endpoints.pricing, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({ anonymousId: getAnonymousId(), variants })
        });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        const prices = data.prices || {};
        nodes.forEach((node) => {
          const next = prices[node.dataset.variantId];
          if (next && next.formatted) {
            node.textContent = next.formatted;
            node.dataset.pricingSource = 'dynamic';
          }
        });
      } catch (error) {
        // Shopify-rendered Liquid prices remain the safe fallback.
      }
    }
  }

  const events = new EventQueue();
  const wishlist = new WishlistService(events);
  const recommendations = new RecommendationService(events);
  const workflows = new FormWorkflowService(events);
  const pricing = new DynamicPricingService(events);

  const hydrateWishlistButtons = () => {
    document.querySelectorAll('[data-wishlist-toggle]').forEach((button) => {
      const product = {
        productId: button.dataset.productId,
        variantId: button.dataset.variantId,
        title: button.dataset.productTitle,
        url: button.dataset.productUrl,
        image: button.dataset.productImage
      };
      button.classList.toggle('is-active', wishlist.has(product.productId));
      button.setAttribute('aria-pressed', wishlist.has(product.productId) ? 'true' : 'false');
      button.addEventListener('click', () => {
        wishlist.set(product);
        button.classList.toggle('is-active', wishlist.has(product.productId));
        button.setAttribute('aria-pressed', wishlist.has(product.productId) ? 'true' : 'false');
      });
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    hydrateWishlistButtons();
    recommendations.hydrate();
    pricing.hydrate();
    workflows.bindReturnForms();
    workflows.bindReviewForms();
    workflows.bindTrackingForms();
    events.flush();
  });

  window.addEventListener('online', () => events.flush());
  window.ClootCommerce = { events, wishlist };
})();
