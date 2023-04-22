/*
  Warnings:

  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "address" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT NOT NULL;
