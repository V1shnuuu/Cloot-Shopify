CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  shopify_customer_id TEXT UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE wishlists (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id) ON DELETE CASCADE,
  anonymous_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT wishlist_owner CHECK (customer_id IS NOT NULL OR anonymous_id IS NOT NULL)
);

CREATE TABLE wishlist_items (
  id BIGSERIAL PRIMARY KEY,
  wishlist_id BIGINT NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  shopify_product_id TEXT NOT NULL,
  shopify_variant_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (wishlist_id, shopify_product_id, shopify_variant_id)
);

CREATE INDEX idx_wishlist_items_product ON wishlist_items(shopify_product_id);

CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  topic TEXT NOT NULL,
  anonymous_id TEXT NOT NULL,
  customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
  session_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_events_topic_time ON analytics_events(topic, occurred_at DESC);
CREATE INDEX idx_analytics_events_payload_gin ON analytics_events USING GIN(payload);

CREATE TABLE recommendation_snapshots (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id) ON DELETE CASCADE,
  anonymous_id TEXT,
  context_key TEXT NOT NULL,
  strategy TEXT NOT NULL,
  product_ids JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recommendations_context ON recommendation_snapshots(context_key, generated_at DESC);

CREATE TABLE return_requests (
  id BIGSERIAL PRIMARY KEY,
  shopify_order_id TEXT,
  order_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  reason TEXT NOT NULL,
  notes TEXT,
  line_item_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_return_requests_email ON return_requests(customer_email);
CREATE INDEX idx_return_requests_status ON return_requests(status, created_at DESC);

CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  shopify_product_id TEXT NOT NULL,
  customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  moderated_at TIMESTAMPTZ
);

CREATE INDEX idx_reviews_product_status ON reviews(shopify_product_id, status, created_at DESC);

CREATE TABLE inventory_reservations (
  id BIGSERIAL PRIMARY KEY,
  reservation_id TEXT NOT NULL UNIQUE,
  shopify_order_id TEXT NOT NULL,
  status TEXT NOT NULL,
  lines JSONB NOT NULL,
  warehouse_id TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_inventory_reservations_order ON inventory_reservations(shopify_order_id);

CREATE TABLE notification_outbox (
  id BIGSERIAL PRIMARY KEY,
  topic TEXT NOT NULL,
  recipient TEXT NOT NULL,
  channel TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  attempts INT NOT NULL DEFAULT 0,
  available_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notification_outbox_status ON notification_outbox(status, available_at);

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_subject ON audit_logs(subject_id, created_at DESC);
