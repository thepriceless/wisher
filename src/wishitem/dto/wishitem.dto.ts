import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMaxSize, IsAscii, IsInt, IsNumber, IsString, IsUUID, IsUrl, Max, MaxLength, Min } from 'class-validator';

export class WishitemDto {
  @IsUUID()
  @ApiProperty({ description: 'The ID of the wish item' })
  id: string;

  @IsString()
  @MaxLength(60, {
    message: 'Title is too long. Maximum length is 60 characters.',
  })
  @ApiProperty({ description: 'The title of the wish item' })
  title: string;

  @IsString()
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

  @IsUUID()
  @ApiProperty({
    description: 'The ID of the wishlist that the wish item belongs to',
  })
  wishlistId: string;

  @IsUrl({}, { message: 'Image link must be a valid URL' })
  @ApiProperty({ description: 'The image link of the wish item' })
  imageLink: string;

  @ApiProperty({ description: 'The image link file name of the wish item' })
  imageLinkAsKey: string;

  //@ArrayMaxSize(3)
  @ApiPropertyOptional({ description: 'The item shop links of the wish item' })
  itemshopLinks?: string[];
}
