/*
  Warnings:

  - You are about to drop the column `nomeProjeto` on the `Cliente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "nomeProjeto";

-- CreateTable
CREATE TABLE "Desafio" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "imagem" TEXT,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Desafio_pkey" PRIMARY KEY ("id")
);
