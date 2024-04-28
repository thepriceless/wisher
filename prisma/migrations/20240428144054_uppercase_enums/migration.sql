/*
  Warnings:

  - The values [Public,Friendly,Private] on the enum `PrivacyType` will be removed. If these variants are still used in the database, this will fail.
  - The values [ItemAdded,ItemDeleted] on the enum `WishlistUpdateNotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PrivacyType_new" AS ENUM ('PUBLIC', 'FRIENDS', 'PRIVATE');
ALTER TABLE "Wishlist" ALTER COLUMN "privacy" TYPE "PrivacyType_new" USING ("privacy"::text::"PrivacyType_new");
ALTER TYPE "PrivacyType" RENAME TO "PrivacyType_old";
ALTER TYPE "PrivacyType_new" RENAME TO "PrivacyType";
DROP TYPE "PrivacyType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "WishlistUpdateNotificationType_new" AS ENUM ('ITEMADDED', 'ITEMDELETED');
ALTER TABLE "WishlistUpdateNotification" ALTER COLUMN "type" TYPE "WishlistUpdateNotificationType_new" USING ("type"::text::"WishlistUpdateNotificationType_new");
ALTER TYPE "WishlistUpdateNotificationType" RENAME TO "WishlistUpdateNotificationType_old";
ALTER TYPE "WishlistUpdateNotificationType_new" RENAME TO "WishlistUpdateNotificationType";
DROP TYPE "WishlistUpdateNotificationType_old";
COMMIT;
