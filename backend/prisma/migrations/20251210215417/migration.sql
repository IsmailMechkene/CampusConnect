/*
  Warnings:

  - Made the column `brandEmail` on table `stores` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "stores" ALTER COLUMN "brandEmail" SET NOT NULL;
