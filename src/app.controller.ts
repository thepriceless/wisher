import {
  Controller,
  Get,
  Headers,
  Param,
  Query,
  Render,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { TimeInterceptor } from './interceptors/time.interceptor';
import { WishitemEntity } from './wishes/wishitem.entity';
import { WisherService } from './wishes/wisher.service';
import { Public } from './auth/decorators/public.decorator';
import { UserEntity } from './user/user.entity';
import { UserService } from './user/user.service';
import { WishlistService } from './wishes/wishlist.service';
import { FriendRequestState } from './user/friend.request.state.enum';
import { WishlistEntity } from './wishes/wishlist.entity';

@Controller()
@UseInterceptors(TimeInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly wisherService: WisherService,
    private readonly wishlistService: WishlistService,
    private readonly userService: UserService,
  ) {}
  @Get('/wishlists')
  @Render('myWishlists')
  async myWishlist(
    @Headers('authorization') authorization: string,
  ): Promise<{ wishlists: WishlistEntity[]; authorizedUser: UserEntity }> {
    try {
      const authorizedUser =
        await this.userService.getUserFromToken(authorization);
      const wishlists =
        await this.wishlistService.getWishlistsByOwner(authorizedUser);
      return {
        wishlists: wishlists,
        authorizedUser: authorizedUser,
      };
    } catch (err) {}
  }

  @Get('/friends')
  @Render('friends')
  async friends(
    @Headers('authorization') authorization: string,
  ): Promise<{ friends: UserEntity[]; authorizedUser: UserEntity }> {
    try {
      const authorizedUser =
        await this.userService.getUserFromToken(authorization);
      const friends = await this.userService.findFriendsByNickname(
        authorizedUser.nickname,
      );
      return {
        friends: friends,
        authorizedUser: authorizedUser,
      };
    } catch (err) {}
  }

  @Get()
  @Render('wisher')
  @Public()
  async wisher(
    @Headers('authorization') authorization: string,
  ): Promise<{ wishitem: WishitemEntity; authorizedUser: UserEntity }> {
    let authorizedUser;
    try {
      authorizedUser = await this.userService.getUserFromToken(authorization);
    } catch (err) {
      authorizedUser = null;
    }

    const item = await this.wisherService.getRandomWishitem();
    return {
      wishitem: item,
      authorizedUser: authorizedUser,
    };
  }

  @Get('/wishlists/:id')
  @Render('oneWishlist')
  async getWishlist(
    @Headers('authorization') authorization: string,
    @Param('id') id: string,
  ): Promise<{
    wishitems: WishitemEntity[];
    wishlistId: string;
    isOwner: boolean;
    authorizedUser: UserEntity;
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

    return {
      wishitems: wishitems,
      wishlistId: id,
      isOwner: isOwner,
      authorizedUser: authorizedUser,
    };
  }

  @Get('/wishitems/new')
  @Render('uploadItemToWishlist')
  async uploadItem(
    @Headers('authorization') authorization: string,
  ): Promise<{ authorizedUser: UserEntity }> {
    const authorizedUser =
      await this.userService.getUserFromToken(authorization);
    return {
      authorizedUser: authorizedUser,
    };
  }

  @Get('/users/search')
  @Render('userSearchResults')
  async getUsersByNicknameStart(
    @Headers('authorization') authorization: string,
    @Query('nickname') nicknameStart: string,
  ): Promise<{
    users: UserEntity[];
    authorizedUser: UserEntity;
  }> {
    const authorizedUser =
      await this.userService.getUserFromToken(authorization);
    const users = await this.userService.findAllByNicknameStart(nicknameStart);

    return {
      users: users,
      authorizedUser: authorizedUser,
    };
  }

  @Get('/users/:nickname')
  @Render('userProfile')
  async getUserProfile(
    @Headers('authorization') authorization: string,
    @Param('nickname') nickname: string,
  ): Promise<{
    user: UserEntity;
    friendshipState: string;
    isGuest: boolean;
    authorizedUser: UserEntity;
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

    return {
      user: host,
      friendshipState: FriendRequestState[friendshipState],
      isGuest: isGuest,
      authorizedUser: authorizedUser,
    };
  }

  @Get('/wishitems/:id')
  @Render('oneWishitem')
  async getWishitemById(
    @Headers('authorization') authorization: string,
    @Param('id') id: string,
  ): Promise<{ wishitem: WishitemEntity; authorizedUser: UserEntity }> {
    const wishitem = await this.wishlistService.getWishitemById(id);
    const authorizedUser =
      await this.userService.getUserFromToken(authorization);

    return {
      wishitem: wishitem,
      authorizedUser: authorizedUser,
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
