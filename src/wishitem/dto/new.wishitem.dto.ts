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
  IsOptional,
  IsUUID,
} from 'class-validator';

export class NewWishitemDto {
  @IsString()
  @MaxLength(60, {
    message: 'Title is too long. Maximum length is 60 characters.',
  })
  @ApiProperty({ description: 'The title of the wish item' })
  title: string;

  @IsString()
  @MaxLength(300, {
    message: 'Title is too long. Maximum length is 300 characters.',
  })
  @ApiProperty({ description: 'The description of the wish item' })
  description: string;

  @IsInt()
  @Min(1, { message: 'Importance must be at least 1' })
  @Max(5, { message: 'Importance must be at most 5' })
  @ApiProperty({ description: 'The importance of the wish item' })
  importance: number;

  @IsOptional()
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @MaxLength(400, { each: true })
  @ApiPropertyOptional({ description: 'The item shop links of the wish item' })
  itemshopLinks: string[];

  @IsIn(['PUBLIC', 'PRIVATE', 'FRIENDS'])
  @ApiProperty({ description: 'The privacy type of the holder wishlist' })
  holderWishlistPrivacy: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  existingWishitemId: string;
}
