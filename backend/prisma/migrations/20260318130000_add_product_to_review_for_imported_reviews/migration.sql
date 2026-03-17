ALTER TABLE "Review"
ADD COLUMN "productId" UUID;

CREATE INDEX "Review_productId_idx" ON "Review"("productId");

ALTER TABLE "Review"
ADD CONSTRAINT "Review_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "products"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
