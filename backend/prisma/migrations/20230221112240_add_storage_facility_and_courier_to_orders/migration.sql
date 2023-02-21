-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "courierId" TEXT,
ADD COLUMN     "storageFacilityId" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_storageFacilityId_fkey" FOREIGN KEY ("storageFacilityId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
