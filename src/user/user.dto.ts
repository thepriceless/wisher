import { WishlistEntity } from 'src/wishlist/wishlist.entity';
import { UserEntity } from './user.entity';

export class UserDto {
  constructor(userDto: UserEntity) {
    this.nickname = userDto.nickname;
    this.name = userDto.name;
    this.surname = userDto.surname;
    this.photoLink = userDto.photoLink;
  }

  nickname: string;
  name: string;
  surname: string;
  photoLink: string;
  ownedWishlists?: WishlistEntity[];
}
