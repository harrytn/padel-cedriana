CREATE UNIQUE INDEX "Booking_active_slot_key"
ON "Booking" ("date", "slot_start")
WHERE "status" IN ('PENDING_PAYMENT', 'PAID', 'ARRIVED', 'NO_SHOW');