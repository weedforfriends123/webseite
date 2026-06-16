-- Supabase SQL Editor: https://supabase.com/dashboard/project/ypvwkfmpzeqicvgexgbz/sql
-- Einmalig ausführen, um den pg_cron Cleanup-Job zu registrieren.
--
-- Was es tut: Markiert Orders die seit > 24h "pending" sind als "cancelled".
-- Das greift als Sicherheitsnetz wenn Zapier komplett ausgefallen war.
-- Orders die tatsächlich bezahlt wurden hat der Zapier-Zap (check-payment)
-- vorher schon als "paid" markiert, sodass sie hier nicht angefasst werden.

-- pg_cron aktivieren (falls noch nicht aktiv):
-- In Supabase → Extensions → pg_cron → Enable

SELECT cron.schedule(
  'cancel-expired-pending-orders',   -- Job-Name (eindeutig)
  '0 * * * *',                       -- Jede volle Stunde
  $$
    UPDATE pending_orders
    SET status = 'cancelled'
    WHERE status  = 'pending'
      AND created_at < NOW() - INTERVAL '24 hours';
  $$
);

-- Job-Liste anzeigen:
-- SELECT * FROM cron.job;

-- Job entfernen (falls nötig):
-- SELECT cron.unschedule('cancel-expired-pending-orders');
