/*
  Warnings:

  - Added the required column `addressLatitude` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressLongitude` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "addressLatitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "addressLongitude" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ProductItem" ADD COLUMN     "buyerId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "addressLatitude" DOUBLE PRECISION,
ADD COLUMN     "addressLongitude" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "ProductItem" ADD CONSTRAINT "ProductItem_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
