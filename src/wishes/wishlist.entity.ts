import { PrivacyType, Wishlist } from '@prisma/client';

export class WishlistEntity implements Wishlist {
  id: string;
  title: string;
  ownerNickname: string;
  privacy: PrivacyType;
}
