-- CreateEnum
CREATE TYPE "PrivacyType" AS ENUM ('Public', 'Friendly', 'Private');

-- CreateEnum
CREATE TYPE "WishlistUpdateNotificationType" AS ENUM ('ItemAdded', 'ItemDeleted');

-- CreateTable
CREATE TABLE "Wishitem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "importance" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Wishitem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishitemLink" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "WishitemLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL,
    "ownerNickname" TEXT NOT NULL,
    "privacy" "PrivacyType" NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "nickname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "photoLink" TEXT
);

-- CreateTable
CREATE TABLE "PrivateWishlistAcl" (
    "wishlistId" TEXT NOT NULL,
    "userNickname" TEXT NOT NULL,

    CONSTRAINT "PrivateWishlistAcl_pkey" PRIMARY KEY ("wishlistId","userNickname")
);

-- CreateTable
CREATE TABLE "UpdateSubscriptions" (
    "wishlistId" TEXT NOT NULL,
    "userNickname" TEXT NOT NULL,

    CONSTRAINT "UpdateSubscriptions_pkey" PRIMARY KEY ("wishlistId","userNickname")
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "sent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("senderId","receiverId")
);

-- CreateTable
CREATE TABLE "WishlistUpdateNotification" (
    "receiverNickname" TEXT NOT NULL,
    "wishlistId" TEXT NOT NULL,
    "type" "WishlistUpdateNotificationType" NOT NULL,

    CONSTRAINT "WishlistUpdateNotification_pkey" PRIMARY KEY ("receiverNickname","wishlistId")
);

-- CreateTable
CREATE TABLE "_WishitemToWishlist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_WishitemToWishitemLink" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "_WishitemToWishlist_AB_unique" ON "_WishitemToWishlist"("A", "B");

-- CreateIndex
CREATE INDEX "_WishitemToWishlist_B_index" ON "_WishitemToWishlist"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WishitemToWishitemLink_AB_unique" ON "_WishitemToWishitemLink"("A", "B");

-- CreateIndex
CREATE INDEX "_WishitemToWishitemLink_B_index" ON "_WishitemToWishitemLink"("B");

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_ownerNickname_fkey" FOREIGN KEY ("ownerNickname") REFERENCES "User"("nickname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateWishlistAcl" ADD CONSTRAINT "PrivateWishlistAcl_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateWishlistAcl" ADD CONSTRAINT "PrivateWishlistAcl_userNickname_fkey" FOREIGN KEY ("userNickname") REFERENCES "User"("nickname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateSubscriptions" ADD CONSTRAINT "UpdateSubscriptions_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateSubscriptions" ADD CONSTRAINT "UpdateSubscriptions_userNickname_fkey" FOREIGN KEY ("userNickname") REFERENCES "User"("nickname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("nickname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("nickname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistUpdateNotification" ADD CONSTRAINT "WishlistUpdateNotification_receiverNickname_fkey" FOREIGN KEY ("receiverNickname") REFERENCES "User"("nickname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistUpdateNotification" ADD CONSTRAINT "WishlistUpdateNotification_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WishitemToWishlist" ADD CONSTRAINT "_WishitemToWishlist_A_fkey" FOREIGN KEY ("A") REFERENCES "Wishitem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WishitemToWishlist" ADD CONSTRAINT "_WishitemToWishlist_B_fkey" FOREIGN KEY ("B") REFERENCES "Wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WishitemToWishitemLink" ADD CONSTRAINT "_WishitemToWishitemLink_A_fkey" FOREIGN KEY ("A") REFERENCES "Wishitem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WishitemToWishitemLink" ADD CONSTRAINT "_WishitemToWishitemLink_B_fkey" FOREIGN KEY ("B") REFERENCES "WishitemLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
