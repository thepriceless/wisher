import { FriendRequest } from '@prisma/client';

export class FriendRequestEntity implements FriendRequest {
  senderNickname: string;
  receiverNickname: string;
  sent: Date;
}
