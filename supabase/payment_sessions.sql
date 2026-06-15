-- Einmalig im Supabase Dashboard (SQL Editor) ausführen:
-- https://supabase.com/dashboard/project/ypvwkfmpzeqicvgexgbz/sql

CREATE TABLE IF NOT EXISTS payment_sessions (
  token       TEXT PRIMARY KEY,
  payment_url TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Alte Einträge automatisch nach 1 Stunde löschen (optional aber empfohlen)
-- Benötigt pg_cron Extension (in Supabase aktivierbar unter Database > Extensions)
-- SELECT cron.schedule('cleanup-payment-sessions', '*/30 * * * *',
--   $$DELETE FROM payment_sessions WHERE created_at < NOW() - INTERVAL '1 hour'$$);
