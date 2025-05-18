/*
  Warnings:

  - Made the column `nomeProjeto` on table `Cliente` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cliente" ALTER COLUMN "nomeProjeto" SET NOT NULL;
