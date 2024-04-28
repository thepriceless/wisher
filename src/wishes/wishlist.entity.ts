// model Wishlist {
//     id                   String                       @id @default(uuid())
//     owner                User                         @relation(fields: [ownerNickname], references: [nickname])
//     ownerNickname        String
//     wishitems            Wishitem[]
//     updateSubscribers    UpdateSubscriptions[]
//     updateNotifications  WishlistUpdateNotification[]
//     usersAcl             PrivateWishlistAcl[]
//     privacy              PrivacyType
//     title                String
//   }

import { PrivacyType, Wishlist } from '@prisma/client';

export class WishlistEntity implements Wishlist {
  id: string;
  title: string;
  ownerNickname: string;
  privacy: PrivacyType;
}
