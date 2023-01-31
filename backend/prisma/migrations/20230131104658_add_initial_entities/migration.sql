-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'SUPPLIER_PACKAGING_PERSONNEL', 'SUPPLIER_SALES_IN_CHARGE', 'SUPPLIER_LOGISTICS_IN_CHARGE', 'SUPPLIER_SUPERVISOR', 'STORAGE_FACILITY_COURIER_PERSONNEL', 'STORAGE_FACILITY_LOGISTICS_IN_CHARGE', 'STORAGE_FACILITY_SUPERVISOR', 'MANUFACTURER_PACKAGING_PERSONNEL', 'MANUFACTURER_SALES_IN_CHARGE', 'MANUFACTURER_LOGISTICS_IN_CHARGE', 'MANUFACTURER_COURIER_PERSONNEL', 'MANUFACTURER_SUPERVISOR', 'COURIER', 'RETAILER_SUPERVISOR');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('STORAGE_FACILITY', 'COURIER', 'SUPPLIER', 'MANUFACTURER', 'RETAILER');

-- CreateEnum
CREATE TYPE "ProductItemStatus" AS ENUM ('IN_STORAGE', 'ON_HOLD', 'TO_BE_PICKED_UP', 'IN_TRANSIT', 'COMPLETE', 'CANCELED', 'RED_FLAG');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyId" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "CompanyType" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "bulk" BOOLEAN NOT NULL,
    "bulkQuantity" INTEGER,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rfid" TEXT NOT NULL,
    "status" "ProductItemStatus" NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "productItemId" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "sendingCompanyId" TEXT NOT NULL,
    "receivingCompanyId" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductItemToTransaction" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductItem_rfid_key" ON "ProductItem"("rfid");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductItemToTransaction_AB_unique" ON "_ProductItemToTransaction"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductItemToTransaction_B_index" ON "_ProductItemToTransaction"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductItem" ADD CONSTRAINT "ProductItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_productItemId_fkey" FOREIGN KEY ("productItemId") REFERENCES "ProductItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sendingCompanyId_fkey" FOREIGN KEY ("sendingCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receivingCompanyId_fkey" FOREIGN KEY ("receivingCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductItemToTransaction" ADD CONSTRAINT "_ProductItemToTransaction_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductItemToTransaction" ADD CONSTRAINT "_ProductItemToTransaction_B_fkey" FOREIGN KEY ("B") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
