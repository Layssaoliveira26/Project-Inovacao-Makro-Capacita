/*
  Warnings:

  - You are about to drop the column `desafioOrigem` on the `Submissao` table. All the data in the column will be lost.
  - You are about to drop the `Formulario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `resumo` to the `Desafio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Desafio` table without a default value. This is not possible if the table is not empty.
  - Made the column `imagem` on table `Desafio` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `desafioId` to the `Submissao` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Contatos_email_key";

-- DropIndex
DROP INDEX "Submissao_email_key";

-- AlterTable
ALTER TABLE "Desafio" ADD COLUMN     "resumo" TEXT NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL,
ALTER COLUMN "imagem" SET NOT NULL;

-- AlterTable
ALTER TABLE "Submissao" DROP COLUMN "desafioOrigem",
ADD COLUMN     "desafioId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Formulario";

-- CreateTable
CREATE TABLE "Cases" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Cases_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submissao" ADD CONSTRAINT "Submissao_desafioId_fkey" FOREIGN KEY ("desafioId") REFERENCES "Desafio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
