import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/user.dto';
import { WishitemDto } from 'src/wishitem/dto/wishitem.dto';

export class GetUserProfileResponse {
  @ApiProperty({ type: UserDto, description: 'Profile owner' })
  user: UserDto;

  @ApiProperty({
    type: String,
    description: 'Friendship state as string literal',
  })
  friendshipState: string;

  @ApiProperty({
    type: Boolean,
    description:
      'Is profile owner a different user from authorizedUser, who sent request?',
  })
  isGuest: boolean;

  @ApiProperty({ type: UserDto, description: 'Authorized user' })
  authorizedUser: UserDto;
}
