import {
  Controller,
  Get,
  Headers,
  Param,
  Query,
  Render,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { TimeInterceptor } from './interceptors/time.interceptor';
import { WishitemEntity } from './wishitem/wishitem.entity';
import { Public } from './auth/decorators/public.decorator';
import { UserEntity } from './user/user.entity';
import { UserService } from './user/user.service';
import { WishlistService } from './wishlist/wishlist.service';
import { FriendRequestState } from './user/friend-request-types/friend.request.state.enum';
import { WishlistEntity } from './wishlist/wishlist.entity';
import { WishitemService } from './wishitem/wishitem.service';
import { WishlistDto } from './wishlist/wishlist.dto';
import { UserDto } from './user/user.dto';
import { WishitemDto } from './wishitem/dto/wishitem.dto';
import { WishitemMapper } from './wishitem/wishitem.mapper';
import { WishlistsWithUser } from './types/wishlists.with.user';
import { UsersWithUser } from './types/users.with.user';
import { WishitemWithUser } from './types/wishitem.with.user';
import { GetWishlistResponse } from './types/get.wishlist.response';
import { GetUserProfileResponse } from './types/get.user.profile.response';

@ApiTags('Frontend')
@ApiUnauthorizedResponse({
  description:
    'Requestor is unable to send this request. Requestor should register / login in the app',
})
@Controller()
@UseInterceptors(TimeInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly wishlistService: WishlistService,
    private readonly wishitemService: WishitemService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: 'Get wishlists that are owned by user specified in authorization',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiOkResponse({
    description: 'Wishlists are successfully returned',
    type: WishlistsWithUser,
  })
  @ApiBearerAuth()
  @Get('/wishlists')
  @Render('myWishlists')
  async myWishlists(
    @Headers('authorization') authorization: string,
  ): Promise<{ wishlists: WishlistDto[]; authorizedUser: UserDto }> {
    try {
      const authorizedUser =
        await this.userService.getUserFromToken(authorization);
      const wishlists =
        await this.wishlistService.getWishlistsByOwner(authorizedUser);

      const wishlistsDto = wishlists.map(
        (wishlist) => new WishlistDto(wishlist),
      );
      const authorizedUserDto = new UserDto(authorizedUser);
      return {
        wishlists: wishlistsDto,
        authorizedUser: authorizedUserDto,
      };
    } catch (err) {}
  }

  @ApiOperation({
    summary: 'Get friends of user specified in authorization',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiOkResponse({
    description: 'List of friends is successfully returned',
    type: UsersWithUser,
  })
  @ApiBearerAuth()
  @Get('/friends')
  @Render('friends')
  async friends(
    @Headers('authorization') authorization: string,
  ): Promise<{ friends: UserDto[]; authorizedUser: UserDto }> {
    try {
      const authorizedUser =
        await this.userService.getUserFromToken(authorization);
      const friends = await this.userService.findFriendsByNickname(
        authorizedUser.nickname,
      );

      const friendsDto = friends.map((friend) => new UserDto(friend));
      const authorizedUserDto = new UserDto(authorizedUser);
      return {
        friends: friendsDto,
        authorizedUser: authorizedUserDto,
      };
    } catch (err) {}
  }

  @ApiOperation({
    summary:
      "Get single random wishitem from DB. Doesn't require authorization",
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
    required: false,
  })
  @ApiOkResponse({
    description: 'Single random item is successfully returned',
    type: WishitemWithUser,
  })
  @Get('/wisher')
  @Render('wisher')
  @Public()
  async wisher(
    @Headers('authorization') authorization: string,
  ): Promise<{ wishitem: WishitemDto; authorizedUser: UserDto }> {
    let authorizedUserDto;
    try {
      const authorizedUser =
        await this.userService.getUserFromToken(authorization);
      authorizedUserDto = new UserDto(authorizedUser);
    } catch (err) {
      authorizedUserDto = null;
    }

    const item = await this.wishitemService.getRandomWishitem();

    const itemDto = WishitemMapper.toDto(item);

    return {
      wishitem: itemDto,
      authorizedUser: authorizedUserDto,
    };
  }

  @ApiOperation({
    summary: 'Get single wishlist by its id',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiParam({
    name: 'id',
    description: 'Wishlist id',
    required: true,
  })
  @ApiOkResponse({
    description: 'Single random item is successfully returned',
    type: GetWishlistResponse,
  })
  @ApiNotFoundResponse({
    description: "Wishlist with specified id was doesn't exist",
  })
  @ApiBearerAuth()
  @Get('/wishlists/:id')
  @Render('oneWishlist')
  async getWishlist(
    @Headers('authorization') authorization: string,
    @Param('id') id: string,
  ): Promise<{
    wishitems: WishitemDto[];
    wishitemsCount: number;
    wishlistId: string;
    isOwner: boolean;
    authorizedUser: UserDto;
  }> {
    const authorizedUser =
      await this.userService.getUserFromToken(authorization);

    const userWithWishlists = await this.userService.findUserWithWishlists(
      authorizedUser.nickname,
    );
    const isOwner = userWithWishlists.ownedWishlists.some(
      (wishlist) => wishlist.id === id,
    );

    const wishitems = await this.wishlistService.getWishitemsByWishlistId(id);

    const wishitemsDto = wishitems.map((wishitem) =>
      WishitemMapper.toDto(wishitem),
    );
    const authorizedUserDto = new UserDto(authorizedUser);
    return {
      wishitems: wishitemsDto,
      wishitemsCount: wishitemsDto.length,
      wishlistId: id,
      isOwner: isOwner,
      authorizedUser: authorizedUserDto,
    };
  }

  @ApiOperation({
    summary: 'Get page for uploading new item to wishlist',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiOkResponse({
    description:
      'Rendered page for uploading new item to wishlist and authorized user is returned',
    type: UserDto,
  })
  @ApiBearerAuth()
  @Get('/wishitems/new')
  @Render('uploadItemToWishlist')
  async uploadItem(
    @Headers('authorization') authorization: string,
  ): Promise<{ authorizedUser: UserDto }> {
    const authorizedUser =
      await this.userService.getUserFromToken(authorization);

    const authorizedUserDto = new UserDto(authorizedUser);
    return {
      authorizedUser: authorizedUserDto,
    };
  }

  @ApiOperation({
    summary:
      'Get list of users, whose nicknames start with specified nicknameStart',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiOkResponse({
    description:
      'List of users, whose nicknames start with specified nicknameStart, is successfully returned',
    type: UsersWithUser,
  })
  @ApiBearerAuth()
  @Get('/users/search')
  @Render('userSearchResults')
  async getUsersByNicknameStart(
    @Headers('authorization') authorization: string,
    @Query('nickname') nicknameStart: string,
  ): Promise<{
    users: UserDto[];
    authorizedUser: UserDto;
  }> {
    const authorizedUser =
      await this.userService.getUserFromToken(authorization);
    const users = await this.userService.findAllByNicknameStart(nicknameStart);

    const usersDto = users.map((user) => new UserDto(user));
    const authorizedUserDto = new UserDto(authorizedUser);
    return {
      users: usersDto,
      authorizedUser: authorizedUserDto,
    };
  }

  @ApiOperation({
    summary: 'Get profile of user specified by nickname',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiParam({
    name: 'nickname',
    description: 'Nickname of user, whose profile is requested',
    required: true,
  })
  @ApiOkResponse({
    description:
      'Profile page of user specified by nickname is successfully returned',
    type: GetUserProfileResponse,
  })
  @ApiNotFoundResponse({
    description: "User with specified nickname doesn't exist",
  })
  @ApiBearerAuth()
  @Get('/users/:nickname')
  @Render('userProfile')
  async getUserProfile(
    @Headers('authorization') authorization: string,
    @Param('nickname') nickname: string,
  ): Promise<{
    user: UserDto;
    friendshipState: string;
    isGuest: boolean;
    authorizedUser: UserDto;
  }> {
    const guest = await this.userService.getUserFromToken(authorization);
    const host = await this.userService.findOneByNickname(nickname);

    const friendshipState = await this.userService.getUserFriendship(
      guest.nickname,
      host.nickname,
    );

    const isGuest = guest.nickname !== host.nickname;
    const authorizedUser =
      await this.userService.getUserFromToken(authorization);

    const hostDto = new UserDto(host);
    const authorizedUserDto = new UserDto(authorizedUser);
    return {
      user: hostDto,
      friendshipState: FriendRequestState[friendshipState],
      isGuest: isGuest,
      authorizedUser: authorizedUserDto,
    };
  }

  @ApiOperation({
    summary: 'Get single wishitem by specified id',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiParam({
    name: 'id',
    description: 'Wishitem id',
    required: true,
  })
  @ApiOkResponse({
    description:
      'Wishitem with specified id is successfully returned with authorized user',
    type: WishitemWithUser,
  })
  @ApiNotFoundResponse({
    description: 'Wishitem with specified id was not found',
  })
  @ApiBearerAuth()
  @Get('/wishitems/:id')
  @Render('oneWishitem')
  async getWishitemById(
    @Headers('authorization') authorization: string,
    @Param('id') id: string,
  ): Promise<{ wishitem: WishitemDto; authorizedUser: UserDto }> {
    const wishitem = await this.wishitemService.getWishitemById(id);
    const authorizedUser =
      await this.userService.getUserFromToken(authorization);

    const wishitemDto = WishitemMapper.toDto(wishitem);
    const authorizedUserDto = new UserDto(authorizedUser);
    return {
      wishitem: wishitemDto,
      authorizedUser: authorizedUserDto,
    };
  }

  @ApiOperation({
    summary: 'Get login page for unauthorized users',
  })
  @ApiOkResponse({
    description: 'Rendered page is returned',
  })
  @Get('/auth/login')
  @Render('login')
  @Public()
  async login(): Promise<void> {
    return;
  }

  @ApiOperation({
    summary: 'Get register page for unauthorized users',
  })
  @ApiOkResponse({
    description: 'Rendered page is returned',
  })
  @Get('/auth/register')
  @Render('register')
  @Public()
  async register(): Promise<void> {
    return;
  }

  @Get('/')
  @Render('redirectionToWisher')
  @Public()
  async redirectionToWisher(): Promise<void> {
    return;
  }
}
