import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/user.dto';
import { WishitemDto } from 'src/wishitem/dto/wishitem.dto';

export class WishitemWithUser {
  @ApiProperty({ type: WishitemDto, description: 'Wishitem' })
  wishitem: WishitemDto;

  @ApiProperty({ type: UserDto, description: 'Authorized user' })
  authorizedUser: UserDto;
}
