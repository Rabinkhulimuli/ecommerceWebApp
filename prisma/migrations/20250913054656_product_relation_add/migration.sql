-- DropIndex
DROP INDEX "public"."Product_price_idx";

-- DropIndex
DROP INDEX "public"."Product_stock_idx";

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "Product_userId_createdAt_idx" ON "public"."Product"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Product_categoryId_isActive_idx" ON "public"."Product"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "Product_userId_idx" ON "public"."Product"("userId");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
