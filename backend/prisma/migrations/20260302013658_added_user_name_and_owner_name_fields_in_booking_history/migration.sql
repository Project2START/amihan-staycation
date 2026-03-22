/*
  Warnings:

  - Added the required column `ownerName` to the `bookings_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `bookings_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings_history" ADD COLUMN     "ownerName" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;
