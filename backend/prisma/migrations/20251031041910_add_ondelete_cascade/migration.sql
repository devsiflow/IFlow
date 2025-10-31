-- DropForeignKey
ALTER TABLE "public"."ItemImage" DROP CONSTRAINT "ItemImage_itemId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ItemImage" ADD CONSTRAINT "ItemImage_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
