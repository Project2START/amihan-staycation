-- CreateTable
CREATE TABLE "payment_methods" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "payment_method" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
