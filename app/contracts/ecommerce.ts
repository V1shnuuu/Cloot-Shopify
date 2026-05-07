export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | string;

export type EventTopic =
  | 'storefront.product_viewed'
  | 'storefront.search_submitted'
  | 'storefront.wishlist_updated'
  | 'cart.updated'
  | 'checkout.started'
  | 'order.created'
  | 'inventory.reserved'
  | 'fulfillment.shipped'
  | 'return.requested'
  | 'review.submitted'
  | 'notification.queued';

export interface Money {
  amount: number;
  currencyCode: CurrencyCode;
}

export interface ProductRef {
  id: string;
  handle: string;
  title: string;
  vendor?: string;
  productType?: string;
  tags: string[];
  metafields?: Record<string, unknown>;
}

export interface VariantRef {
  id: string;
  productId: string;
  sku?: string;
  title: string;
  price: Money;
  compareAtPrice?: Money;
  availableForSale: boolean;
  inventoryPolicy?: 'continue' | 'deny';
}

export interface CustomerRef {
  id?: string;
  email?: string;
  acceptsMarketing?: boolean;
  tags?: string[];
}

export interface CartLineInput {
  variantId: string;
  quantity: number;
  attributes?: Record<string, string>;
}

export interface DiscountContext {
  customer?: CustomerRef;
  cartLines: CartLineInput[];
  subtotal: Money;
  discountCodes: string[];
}

export interface DiscountResult {
  acceptedCodes: string[];
  rejectedCodes: Array<{ code: string; reason: string }>;
  estimatedSavings: Money;
}

export interface PricingContext {
  product: ProductRef;
  variant: VariantRef;
  customer?: CustomerRef;
  inventoryAvailable: number;
  demandScore: number;
}

export interface PricingResult {
  basePrice: Money;
  effectivePrice: Money;
  reasonCodes: string[];
}

export interface RecommendationContext {
  customer?: CustomerRef;
  currentProduct?: ProductRef;
  currentCollectionId?: string;
  viewedProductIds: string[];
  cartVariantIds: string[];
}

export interface RecommendationResult {
  productIds: string[];
  strategy: 'similar_products' | 'complete_the_look' | 'trending' | 'recently_viewed';
  generatedAt: string;
}

export interface InventoryReservationRequest {
  orderId: string;
  lines: CartLineInput[];
  warehouseId?: string;
}

export interface InventoryReservationResult {
  reservationId: string;
  status: 'reserved' | 'partial' | 'rejected';
  rejectedLines: Array<{ variantId: string; reason: string }>;
}

export interface FraudAssessmentRequest {
  checkoutId: string;
  customer?: CustomerRef;
  subtotal: Money;
  shippingCountry?: string;
  paymentGateway?: string;
}

export interface FraudAssessmentResult {
  decision: 'approve' | 'review' | 'reject';
  score: number;
  reasonCodes: string[];
}

export interface ReturnRequestInput {
  orderName: string;
  email: string;
  reason: string;
  lineItemIds?: string[];
  notes?: string;
}

export interface ReturnRequestResult {
  returnId: string;
  status: 'received' | 'approved' | 'needs_review' | 'rejected';
  nextStep: string;
}

export interface AnalyticsEvent {
  topic: EventTopic;
  anonymousId: string;
  customerId?: string;
  sessionId?: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface NotificationInput {
  topic: EventTopic;
  recipient: string;
  channel: 'email' | 'sms' | 'push' | 'admin';
  payload: Record<string, unknown>;
}
