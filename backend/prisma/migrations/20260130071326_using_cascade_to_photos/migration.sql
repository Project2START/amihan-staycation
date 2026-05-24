-- DropForeignKey
ALTER TABLE "photos" DROP CONSTRAINT "photos_productId_fkey";

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
