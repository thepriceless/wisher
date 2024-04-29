/*
  Warnings:

  - You are about to drop the column `intImportance` on the `Wishitem` table. All the data in the column will be lost.
  - Added the required column `importance` to the `Wishitem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wishitem" RENAME COLUMN "intImportance" TO "importance";
