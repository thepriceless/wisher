/*
  Warnings:

  - You are about to drop the column `importance` on the `Wishitem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Wishitem" DROP COLUMN "importance",
ALTER COLUMN "intImportance" DROP DEFAULT;
