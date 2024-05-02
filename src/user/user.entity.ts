import { User } from '@prisma/client';
import { RegisterRequestDto } from 'src/auth/dto/register.request.dto';
import { WishlistEntity } from 'src/wishlist/wishlist.entity';

export class UserEntity implements User {
  constructor(registerRequestDto: RegisterRequestDto) {
    this.nickname = registerRequestDto.nickname;
    this.password = registerRequestDto.password;
    this.name = registerRequestDto.name;
    this.surname = registerRequestDto.surname;
  }

  nickname: string;
  password: string;
  name: string;
  surname: string;
  photoLink: string;
  photoLinkAsKey: string;
  ownedWishlists?: WishlistEntity[];
}
