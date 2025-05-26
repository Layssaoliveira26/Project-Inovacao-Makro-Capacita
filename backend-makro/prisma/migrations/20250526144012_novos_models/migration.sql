/*
  Warnings:

  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Cliente";

-- CreateTable
CREATE TABLE "Submissao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "desafioOrigem" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "documento" TEXT,
    "status" TEXT DEFAULT 'Em análise',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contatos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT DEFAULT 'Em análise',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contatos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Submissao_email_key" ON "Submissao"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Contatos_email_key" ON "Contatos"("email");
