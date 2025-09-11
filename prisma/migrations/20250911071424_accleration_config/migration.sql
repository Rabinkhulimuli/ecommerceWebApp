/*
  Warnings:

  - You are about to drop the column `updateAt` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Address" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."CartItem" ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."OTP" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "OTP_email_createdAt_idx" ON "public"."OTP"("email", "createdAt");

-- CreateIndex
CREATE INDEX "OTP_expiresAt_idx" ON "public"."OTP"("expiresAt");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "public"."Product"("name");

-- CreateIndex
CREATE INDEX "Product_stock_idx" ON "public"."Product"("stock");

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "public"."Review"("createdAt");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "public"."User"("name");
