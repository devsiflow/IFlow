/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."Item" DROP COLUMN "imageUrl",
DROP COLUMN "thumbnailUrl",
ALTER COLUMN "categoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemValidation" ADD CONSTRAINT "ItemValidation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
