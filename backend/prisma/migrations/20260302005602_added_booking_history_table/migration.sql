-- CreateTable
CREATE TABLE "bookings_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "message" TEXT,
    "valid_id_url" TEXT,
    "payment_proof_url" TEXT,
    "action_items" JSONB,
    "hasUserResponded" BOOLEAN NOT NULL,
    "bookingId" UUID NOT NULL,

    CONSTRAINT "bookings_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bookings_history" ADD CONSTRAINT "bookings_history_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
