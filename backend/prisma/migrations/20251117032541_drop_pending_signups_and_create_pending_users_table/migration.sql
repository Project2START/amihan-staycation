/*
  Warnings:

  - You are about to drop the `pending_signups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "pending_signups";

-- CreateTable
CREATE TABLE "pending_users" (
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "verificationCode" INTEGER NOT NULL,
    "codeExpiry" TIMESTAMP(3) NOT NULL,
    "resendCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pending_users_pkey" PRIMARY KEY ("id")
);
