import { User } from '@prisma/client';
import { WishlistEntity } from 'src/wishes/wishlist.entity';

export class UserEntity implements User {
  nickname: string;
  password: string;
  name: string;
  surname: string;
  photoLink: string;
  photoLinkAsKey: string;
}

export class UserEntityWithWishlists extends UserEntity {
  ownedWishlists: WishlistEntity[];
}
