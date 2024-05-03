import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/user.dto';
import { WishitemDto } from 'src/wishitem/dto/wishitem.dto';

export class GetWishlistResponse {
  @ApiProperty({ type: [WishitemDto], description: 'Wishitems' })
  wishitems: WishitemDto[];

  @ApiProperty({ type: String, description: 'Id of returned wishlist' })
  wishlistId: string;

  @ApiProperty({
    type: Boolean,
    description: 'Is requestor and wishlist owner the same user?',
  })
  isOwner: boolean;

  @ApiProperty({ type: UserDto, description: 'Authorized user' })
  authorizedUser: UserDto;
}
