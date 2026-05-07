export const publicAppProxyRoutes = {
  wishlist: '/apps/Cloot/wishlist',
  analyticsEvents: '/apps/Cloot/events',
  recommendations: '/apps/Cloot/recommendations',
  dynamicPricing: '/apps/Cloot/pricing',
  reviews: '/apps/Cloot/reviews',
  returns: '/apps/Cloot/returns',
  tracking: '/apps/Cloot/tracking',
} as const;

export const adminRoutes = {
  analyticsSummary: '/admin/apps/Cloot/analytics',
  moderationQueue: '/admin/apps/Cloot/reviews/moderation',
  supportQueue: '/admin/apps/Cloot/support',
  inventoryReservations: '/admin/apps/Cloot/inventory/reservations',
  auditLog: '/admin/apps/Cloot/audit',
} as const;

export const webhookTopics = [
  'orders/create',
  'orders/paid',
  'orders/fulfilled',
  'refunds/create',
  'products/update',
  'inventory_levels/update',
  'customers/create',
] as const;

export const workerQueues = {
  analytics: 'commerce.analytics.events',
  notifications: 'commerce.notifications.outbox',
  inventory: 'commerce.inventory.reservations',
  recommendations: 'commerce.recommendations.refresh',
  returns: 'commerce.returns.workflow',
  audit: 'commerce.audit.log',
} as const;
