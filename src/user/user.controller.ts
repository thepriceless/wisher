import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { FriendRequestResponseDto } from './friend.request.response.dto';
import { FriendRequestState } from './friend.request.state.enum';
import { UserEntity } from './user.entity';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/friends/request')
  async processFriendRequest(
    @Headers('authorization') authorization: string,
    @Body() body,
  ): Promise<FriendRequestResponseDto> {
    const sender = await this.userService.getUserFromToken(authorization);
    const friendRequestState = await this.userService.processFriendRequest(
      sender.nickname,
      body.receiverNickname,
    );

    return {
      friendRequestState: friendRequestState,
    };
  }

  @Get('/friends/state')
  async getFriendshipState(
    @Headers('authorization') authorization: string,
    @Query('friendee') friendeeNickname: string,
  ): Promise<{ friendshipState: string }> {
    const sender = await this.userService.getUserFromToken(authorization);
    const friendshipState = await this.userService.getUserFriendship(
      sender.nickname,
      friendeeNickname,
    );

    return {
      friendshipState: FriendRequestState[friendshipState],
    };
  }
}
