import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PrivacyType } from '@prisma/client';
import {
  IsString,
  IsAscii,
  MaxLength,
  ArrayMaxSize,
  IsInt,
  IsUrl,
  Max,
  Min,
  IsEnum,
  IsIn,
} from 'class-validator';

export class NewWishitemDto {
  @IsString()
  @IsAscii()
  @MaxLength(60, {
    message: 'Title is too long. Maximum length is 60 characters.',
  })
  @ApiProperty({ description: 'The title of the wish item' })
  title: string;

  @IsString()
  @IsAscii()
  @MaxLength(400, {
    message: 'Title is too long. Maximum length is 400 characters.',
  })
  @ApiProperty({ description: 'The description of the wish item' })
  description: string;

  @IsInt()
  @Min(1, { message: 'Importance must be at least 1' })
  @Max(5, { message: 'Importance must be at most 5' })
  @ApiProperty({ description: 'The importance of the wish item' })
  importance: number;

  @ArrayMaxSize(3)
  //@IsUrl({}, { each: true, message: 'Each item shop link must be a valid URL' })
  @ApiPropertyOptional({ description: 'The item shop links of the wish item' })
  itemshopLinks: string[];

  @IsIn(['PUBLIC', 'PRIVATE', 'FRIENDS'])
  @ApiProperty({ description: 'The privacy type of the holder wishlist' })
  holderWishlistPrivacy: string;
}
