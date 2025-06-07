/*
  Warnings:

  - Made the column `resumo` on table `Cases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `resumo` on table `Desafio` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cases" ALTER COLUMN "resumo" SET NOT NULL;

-- AlterTable
ALTER TABLE "Desafio" ALTER COLUMN "resumo" SET NOT NULL;
