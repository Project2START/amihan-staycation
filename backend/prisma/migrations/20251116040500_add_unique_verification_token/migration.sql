/*
  Warnings:

  - A unique constraint covering the columns `[verificationToken]` on the table `pending_signups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pending_signups_verificationToken_key" ON "pending_signups"("verificationToken");
