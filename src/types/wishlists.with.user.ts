import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/user.dto';
import { WishlistDto } from 'src/wishlist/wishlist.dto';

export class WishlistsWithUser {
  @ApiProperty({ type: [WishlistDto], description: 'List of wishlists' })
  wishlists: WishlistDto[];

  @ApiProperty({ type: UserDto, description: 'Authorized user' })
  authorizedUser: UserDto;
}
