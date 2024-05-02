import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestState } from './friend.request.state.enum';

export class FriendRequestResponseDto {
  @ApiProperty({
    description: 'State of friend request',
  })
  friendRequestState: FriendRequestState;
}
