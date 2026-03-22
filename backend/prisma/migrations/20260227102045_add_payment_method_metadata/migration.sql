-- 1. Add column temporarily nullable
ALTER TABLE "bookings"
ADD COLUMN "paymentMethodId" UUID;

-- 2. Backfill existing rows
UPDATE "bookings"
SET "paymentMethodId" = 'cf825399-b3b6-4bab-9e3e-2c7d8af6c781';

-- 3. Make required
ALTER TABLE "bookings"
ALTER COLUMN "paymentMethodId" SET NOT NULL;

-- 4. Drop old column
ALTER TABLE "bookings"
DROP COLUMN "payment_type";

-- 5. Add foreign key
ALTER TABLE "bookings"
ADD CONSTRAINT "bookings_paymentMethodId_fkey"
FOREIGN KEY ("paymentMethodId")
REFERENCES "payment_methods"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;