INSERT INTO "Settings" (
  id, base_price, racket_price_with_balls, balls_only_price,
  lighting_price, peak_premium, open_hour, close_hour,
  lighting_trigger_hour, peak_slots, slot_duration_minutes, currency
) VALUES (
  1, 100, 5, 10, 20, 10, '08:00', '22:00', '18:30',
  '["17:00","18:30","20:00"]', 90, 'TND'
)
ON CONFLICT (id) DO NOTHING;