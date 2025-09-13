/*
  Warnings:

  - You are about to drop the column `userId` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shopId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shopId,name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shopId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_userId_fkey";

-- DropIndex
DROP INDEX "public"."Product_userId_createdAt_idx";

-- DropIndex
DROP INDEX "public"."Product_userId_idx";

-- AlterTable
ALTER TABLE "public"."Address" ADD COLUMN     "shopId" TEXT;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "userId",
ADD COLUMN     "shopId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Shop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_ownerId_key" ON "public"."Shop"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_name_key" ON "public"."Shop"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Address_shopId_key" ON "public"."Address"("shopId");

-- CreateIndex
CREATE INDEX "Product_shopId_createdAt_idx" ON "public"."Product"("shopId", "createdAt");

-- CreateIndex
CREATE INDEX "Product_shopId_idx" ON "public"."Product"("shopId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_shopId_name_key" ON "public"."Product"("shopId", "name");

-- AddForeignKey
ALTER TABLE "public"."Address" ADD CONSTRAINT "Address_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shop" ADD CONSTRAINT "Shop_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
