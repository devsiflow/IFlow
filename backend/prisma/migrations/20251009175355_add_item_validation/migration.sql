-- CreateTable
CREATE TABLE "public"."ItemValidation" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "itemId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "localPerda" TEXT NOT NULL,
    "detalhesUnicos" TEXT NOT NULL,
    "conteudoInterno" TEXT NOT NULL,
    "momentoPerda" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemValidation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ItemValidation" ADD CONSTRAINT "ItemValidation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
