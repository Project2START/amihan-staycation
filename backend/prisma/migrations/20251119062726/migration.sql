/*
  Warnings:

  - You are about to drop the column `active` on the `users` table. All the data in the column will be lost.
  - Added the required column `nextAllowedResend` to the `pending_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pending_users" ADD COLUMN     "nextAllowedResend" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "active";
