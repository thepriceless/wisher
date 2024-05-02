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
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { TimeInterceptor } from './interceptors/time.interceptor';
import { WishitemEntity } from './wishitem/wishitem.entity';
import { Public } from './auth/decorators/public.decorator';
import { UserEntity } from './user/user.entity';
import { UserService } from './user/user.service';
import { WishlistService } from './wishlist/wishlist.service';
import { FriendRequestState } from './user/friend.request.state.enum';
import { WishlistEntity } from './wishlist/wishlist.entity';
import { WishitemService } from './wishitem/wishitem.service';
import { WishlistDto } from './wishlist/wishlist.dto';
import { UserDto } from './user/user.dto';
import { WishitemDto } from './wishitem/wishitem.dto';
import { WishitemMapper } from './wishitem/wishitem.mapper';

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
  @ApiResponse({
    status: 200,
    description: 'Wishlists are successfully returned',
  })
  @ApiResponse({
    status: 401,
    description:
      'Requestor in unable to send this request. Requestor should register / login in the app',
  })
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

  @Get()
  @Render('wisher')
  @Public()
  async wisher(
    @Headers('authorization') authorization: string,
  ): Promise<{ wishitem: WishitemDto; authorizedUser: UserDto }> {
    let authorizedUser;
    try {
      authorizedUser = await this.userService.getUserFromToken(authorization);
    } catch (err) {
      authorizedUser = null;
    }

    const item = await this.wishitemService.getRandomWishitem();

    const itemDto = WishitemMapper.toDto(item);
    const authorizedUserDto = new UserDto(authorizedUser);
    return {
      wishitem: itemDto,
      authorizedUser: authorizedUserDto,
    };
  }

  @Get('/wishlists/:id')
  @Render('oneWishlist')
  async getWishlist(
    @Headers('authorization') authorization: string,
    @Param('id') id: string,
  ): Promise<{
    wishitems: WishitemDto[];
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
      wishlistId: id,
      isOwner: isOwner,
      authorizedUser: authorizedUserDto,
    };
  }

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

  @Get('/auth/login')
  @Render('login')
  @Public()
  async login(): Promise<void> {
    return;
  }

  @Get('/auth/register')
  @Render('register')
  @Public()
  async register(): Promise<void> {
    return;
  }
}
