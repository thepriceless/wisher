import { PrivacyType } from '@prisma/client';
import { WishlistEntity } from './wishlist.entity';

export class WishlistDto {
  constructor(wishlist: WishlistEntity) {
    this.id = wishlist.id;
    this.title = wishlist.title;
    this.ownerNickname = wishlist.ownerNickname;
    this.privacy = wishlist.privacy;
  }

  id: string;
  title: string;
  ownerNickname: string;
  privacy: PrivacyType;
}
