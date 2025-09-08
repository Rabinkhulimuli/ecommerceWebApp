/*
  Warnings:

  - You are about to drop the column `orderId` on the `Address` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Address" DROP CONSTRAINT "Address_orderId_fkey";

-- DropIndex
DROP INDEX "public"."Address_orderId_key";

-- AlterTable
ALTER TABLE "public"."Address" DROP COLUMN "orderId";

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "shippingId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_shippingId_fkey" FOREIGN KEY ("shippingId") REFERENCES "public"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
