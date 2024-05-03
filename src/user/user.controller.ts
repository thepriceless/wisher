import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { FriendRequestResponseDto } from './friend-request-types/friend.request.response.dto';
import { FriendRequestState } from './friend-request-types/friend.request.state.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { WishitemDto } from 'src/wishitem/dto/wishitem.dto';

@ApiTags('User API')
@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: `
    Process a request to change the state of friendship from sender to receiver.
    Updates the state of friendship between sender and receiver.
  `,
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiBody({
    description: 'Nickname of receiver of friend request',
    type: String,
  })
  @ApiCreatedResponse({
    description:
      'Friend request state is successfully updated. Response contains new state of friendship.',
    type: FriendRequestResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'User with the nickname specified in body was not found. Friend request state is not updated.',
  })
  @ApiBearerAuth()
  @Post('/friends/request')
  async processFriendshipState(
    @Headers('authorization') authorization: string,
    @Body() body,
  ): Promise<FriendRequestResponseDto> {
    const sender = await this.userService.getUserFromToken(authorization);
    const friendRequestState = await this.userService.processFriendshipState(
      sender.nickname,
      body.receiverNickname,
    );

    return {
      friendRequestState: friendRequestState,
    };
  }

  @ApiOperation({
    summary: `
    Get the state of friendship between sender and receiver.
  `,
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiQuery({
    name: 'friendee',
    description: 'Nickname of receiver of friend request',
    type: String,
  })
  @ApiOkResponse({
    description:
      'Friend request state is successfully found. Response contains state of friendship.',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'User with the nickname specified in body was not found',
  })
  @ApiBearerAuth()
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
