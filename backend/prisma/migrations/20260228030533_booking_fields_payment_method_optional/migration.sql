-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_paymentMethodId_fkey";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "paymentMethodId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
