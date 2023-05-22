/*
  Warnings:

  - The values [IN_TRANSIT] on the enum `ProductItemStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'PICKED_UP';

-- AlterEnum
BEGIN;
CREATE TYPE "ProductItemStatus_new" AS ENUM ('IN_STORAGE', 'ON_HOLD', 'TO_BE_PICKED_UP', 'IN_TRANSIT_TO_STORAGE_FACILITY', 'IN_STORAGE_FACILITY', 'IN_TRANSIT_TO_BUYER', 'COMPLETE', 'CANCELED', 'RED_FLAG', 'RETURNING', 'RETURNED');
ALTER TABLE "ProductItem" ALTER COLUMN "status" TYPE "ProductItemStatus_new" USING ("status"::text::"ProductItemStatus_new");
ALTER TYPE "ProductItemStatus" RENAME TO "ProductItemStatus_old";
ALTER TYPE "ProductItemStatus_new" RENAME TO "ProductItemStatus";
DROP TYPE "ProductItemStatus_old";
COMMIT;
