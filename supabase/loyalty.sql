-- Supabase SQL Editor: https://supabase.com/dashboard/project/ypvwkfmpzeqicvgexgbz/sql
-- Einmalig ausführen.

-- 1. user_id-Spalte zu pending_orders hinzufügen
--    (verknüpft Bestellungen mit dem eingeloggten Kundenkonto)
ALTER TABLE pending_orders
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS pending_orders_user_idx ON pending_orders (user_id);

-- 2. loyalty_events Tabelle anlegen
--    type: 'order' | 'welcome' | 'redemption' | 'manual' | 'referral'
--    points: positiv = Punkte erhalten, negativ = Punkte eingelöst
CREATE TABLE IF NOT EXISTS loyalty_events (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT        NOT NULL DEFAULT 'order',
  points      INTEGER     NOT NULL,
  description TEXT,
  order_id    TEXT        REFERENCES pending_orders(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS loyalty_events_user_idx   ON loyalty_events (user_id);
CREATE INDEX IF NOT EXISTS loyalty_events_order_idx  ON loyalty_events (order_id);
-- Unique: nur ein Event pro Order (kein doppeltes Gutschreiben)
CREATE UNIQUE INDEX IF NOT EXISTS loyalty_events_order_unique
  ON loyalty_events (order_id) WHERE type = 'order';

-- 3. Row Level Security: User sieht nur seine eigenen Events
ALTER TABLE loyalty_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user reads own events"
  ON loyalty_events FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Sicherstellen dass profiles.loyalty_points existiert
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS loyalty_points INTEGER NOT NULL DEFAULT 0;
