/*
  Warnings:

  - Added the required column `nomeProjeto` to the `Submissao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submissao" ADD COLUMN     "nomeProjeto" TEXT NOT NULL;
