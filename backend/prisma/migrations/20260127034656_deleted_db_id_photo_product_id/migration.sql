-- DropForeignKey
ALTER TABLE "photos" DROP CONSTRAINT "photos_productId_fkey";

-- AlterTable
ALTER TABLE "photos" ALTER COLUMN "productId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
