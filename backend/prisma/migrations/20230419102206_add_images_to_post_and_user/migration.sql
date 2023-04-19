-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "cloudinaryPublicId" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cloudinaryPublicId" TEXT,
ADD COLUMN     "imageUrl" TEXT;
