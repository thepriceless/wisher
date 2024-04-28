/*
  Warnings:

  - The primary key for the `FriendRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `receiverId` on the `FriendRequest` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `FriendRequest` table. All the data in the column will be lost.
  - Added the required column `receiverNickname` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderNickname` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_senderId_fkey";

-- AlterTable
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_pkey",
DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "receiverNickname" TEXT NOT NULL,
ADD COLUMN     "senderNickname" TEXT NOT NULL,
ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("senderNickname", "receiverNickname");

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderNickname_fkey" FOREIGN KEY ("senderNickname") REFERENCES "User"("nickname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverNickname_fkey" FOREIGN KEY ("receiverNickname") REFERENCES "User"("nickname") ON DELETE RESTRICT ON UPDATE CASCADE;
