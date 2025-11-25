-- CreateEnum
CREATE TYPE "public"."ItemStatus" AS ENUM ('perdido', 'encontrado', 'nao_encontrado');

-- CreateTable
CREATE TABLE "public"."profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "profilePic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "campusId" INTEGER,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."item" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "public"."ItemStatus" NOT NULL DEFAULT 'nao_encontrado',
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "categoryId" INTEGER,
    "campusId" INTEGER,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."item_image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "item_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."item_validation" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "itemId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "localPerda" TEXT NOT NULL,
    "detalhesUnicos" TEXT NOT NULL,
    "conteudoInterno" TEXT NOT NULL,
    "momentoPerda" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_validation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."solicitacoes" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "aluno_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "observacoes" TEXT,
    "data_solicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."campus" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "campus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_matricula_key" ON "public"."profile"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "public"."category"("name");

-- AddForeignKey
ALTER TABLE "public"."profile" ADD CONSTRAINT "profile_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "public"."campus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item" ADD CONSTRAINT "item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item" ADD CONSTRAINT "item_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "public"."campus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item" ADD CONSTRAINT "item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item_image" ADD CONSTRAINT "item_image_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item_validation" ADD CONSTRAINT "item_validation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item_validation" ADD CONSTRAINT "item_validation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solicitacoes" ADD CONSTRAINT "solicitacoes_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solicitacoes" ADD CONSTRAINT "solicitacoes_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
