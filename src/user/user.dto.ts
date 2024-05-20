import { UserEntity } from './user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsAlphanumeric, IsUrl, MaxLength } from 'class-validator';
import { WishlistDto } from 'src/wishlist/wishlist.dto';

export class UserDto {
  constructor(userDto: UserEntity) {
    this.nickname = userDto.nickname;
    this.name = userDto.name;
    this.surname = userDto.surname;
    this.photoLink = userDto.photoLink;
    this.photoLinkAsKey = userDto.photoLinkAsKey;
  }

  @ApiProperty({ description: 'Nickname' })
  @IsAlphanumeric()
  @MaxLength(25, {
    message: 'Nickname is too long. Maximum length is 25 characters.',
  })
  nickname: string;

  @IsAlphanumeric()
  @MaxLength(25, {
    message: 'Name is too long. Maximum length is 25 characters.',
  })
  @ApiProperty({ description: 'Name' })
  name: string;

  @IsAlphanumeric()
  @MaxLength(25, {
    message: 'Surname is too long. Maximum length is 25 characters.',
  })
  @ApiProperty({ description: 'Surname' })
  surname: string;

  @IsUrl()
  @ApiProperty({ description: 'Profile photo link' })
  photoLink: string;

  @ApiProperty({ description: 'Profile photo file name' })
  photoLinkAsKey: string;

  @ApiPropertyOptional({ description: 'Wishlists owned by the user' })
  ownedWishlists?: WishlistDto[];
}
