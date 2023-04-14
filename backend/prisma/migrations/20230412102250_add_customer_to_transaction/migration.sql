-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_receivingCompanyId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "customerId" TEXT,
ALTER COLUMN "receivingCompanyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receivingCompanyId_fkey" FOREIGN KEY ("receivingCompanyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
