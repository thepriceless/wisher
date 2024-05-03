import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/user.dto';
import { WishlistDto } from 'src/wishlist/wishlist.dto';

export class UsersWithUser {
  @ApiProperty({ type: [UserDto], description: 'List of friends' })
  users: UserDto[];

  @ApiProperty({ type: UserDto, description: 'Authorized user' })
  authorizedUser: UserDto;
}
