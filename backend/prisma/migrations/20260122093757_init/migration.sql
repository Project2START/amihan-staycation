-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'user',
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "nationality" TEXT NOT NULL DEFAULT 'Filipino',
    "google_id" TEXT,
    "avatar_url" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrees" (
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "codeExpiry" TIMESTAMP(3) NOT NULL,
    "nextAllowedResend" TIMESTAMP(3) NOT NULL,
    "resendCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "maxPersons" INTEGER NOT NULL,
    "about" VARCHAR(1000),
    "attributes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "image_url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "productId" UUID NOT NULL,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
