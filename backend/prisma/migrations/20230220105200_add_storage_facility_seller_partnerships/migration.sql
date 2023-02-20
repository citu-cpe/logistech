/*
  Warnings:

  - The values [COURIER] on the enum `CompanyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;

DELETE FROM "Company"
  WHERE "type" = 'COURIER';

CREATE TYPE "CompanyType_new" AS ENUM ('STORAGE_FACILITY', 'SUPPLIER', 'MANUFACTURER', 'RETAILER');
ALTER TABLE "Company" ALTER COLUMN "type" TYPE "CompanyType_new" USING ("type"::text::"CompanyType_new");
ALTER TYPE "CompanyType" RENAME TO "CompanyType_old";
ALTER TYPE "CompanyType_new" RENAME TO "CompanyType";
DROP TYPE "CompanyType_old";
COMMIT;

-- CreateTable
CREATE TABLE "_storageFacilitySellerPartners" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_storageFacilitySellerPartners_AB_unique" ON "_storageFacilitySellerPartners"("A", "B");

-- CreateIndex
CREATE INDEX "_storageFacilitySellerPartners_B_index" ON "_storageFacilitySellerPartners"("B");

-- AddForeignKey
ALTER TABLE "_storageFacilitySellerPartners" ADD CONSTRAINT "_storageFacilitySellerPartners_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_storageFacilitySellerPartners" ADD CONSTRAINT "_storageFacilitySellerPartners_B_fkey" FOREIGN KEY ("B") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
