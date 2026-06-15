-- Einmalig im Supabase SQL Editor ausführen:
-- https://supabase.com/dashboard/project/ypvwkfmpzeqicvgexgbz/sql

CREATE TABLE IF NOT EXISTS pending_orders (
  id                TEXT PRIMARY KEY,          -- = order_number (UUID)
  status            TEXT NOT NULL DEFAULT 'pending', -- pending | paid | failed
  email             TEXT NOT NULL,
  phone             TEXT,
  line_items        JSONB NOT NULL,
  shipping_address  JSONB NOT NULL,
  shipping_price    TEXT NOT NULL DEFAULT '0.00',
  amount_cents      INTEGER NOT NULL,
  stripe_session_id TEXT,
  shopify_order_id  BIGINT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Index für schnellen Lookup per Stripe Session ID (für Webhook)
CREATE INDEX IF NOT EXISTS pending_orders_stripe_session_idx
  ON pending_orders (stripe_session_id);
