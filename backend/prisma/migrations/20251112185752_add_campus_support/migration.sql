-- AlterTable
ALTER TABLE "public"."Item" ADD COLUMN     "campusId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "campusId" INTEGER;

-- CreateTable
CREATE TABLE "public"."solicitacoes" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER,
    "aluno_id" UUID,
    "status" VARCHAR(50) DEFAULT 'pendente',
    "observacoes" TEXT,
    "data_solicitacao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Campus" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT,

    CONSTRAINT "Campus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "public"."Campus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "public"."Campus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
