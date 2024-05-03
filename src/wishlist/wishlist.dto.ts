import { ApiProperty } from '@nestjs/swagger';
import { PrivacyType } from '@prisma/client';
import { WishlistEntity } from './wishlist.entity';
import {
  IsAlphanumeric,
  IsAscii,
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class WishlistDto {
  constructor(wishlist: WishlistEntity) {
    this.id = wishlist.id;
    this.title = wishlist.title;
    this.ownerNickname = wishlist.ownerNickname;
    this.privacy = wishlist.privacy;
  }

  @ApiProperty({ description: 'The ID of the wishlist' })
  @IsUUID()
  id: string;

  @IsString()
  @IsAscii()
  @MaxLength(40, {
    message: 'Title is too long. Maximum length is 40 characters.',
  })
  @ApiProperty({ description: 'The title of the wishlist' })
  title: string;

  @IsString()
  @IsAlphanumeric()
  @MaxLength(25, {
    message: 'Nickname is too long. Maximum length is 25 characters.',
  })
  @ApiProperty({ description: 'The nickname of the owner of the wishlist' })
  ownerNickname: string;

  @IsEnum(PrivacyType)
  @ApiProperty({
    description: 'The privacy type of the wishlist',
    enum: PrivacyType,
  })
  privacy: PrivacyType;
}
