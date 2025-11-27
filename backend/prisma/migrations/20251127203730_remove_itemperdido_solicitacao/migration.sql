/*
  Warnings:

  - You are about to drop the `ItemPerdidoSolicitacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ItemPerdidoSolicitacao" DROP CONSTRAINT "ItemPerdidoSolicitacao_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ItemPerdidoSolicitacao" DROP CONSTRAINT "ItemPerdidoSolicitacao_userId_fkey";

-- DropTable
DROP TABLE "public"."ItemPerdidoSolicitacao";
