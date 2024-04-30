import {
  Controller,
  Get,
  Headers,
  Param,
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
  ): Promise<{ wishlists: WishlistEntity[] }> {
    try {
      const user = await this.userService.getUserFromToken(authorization);
      const wishlists = await this.wishlistService.getWishlistsByOwner(user);
      return {
        wishlists: wishlists,
      };
    } catch (err) {}
  }

  @Get('/friends')
  @Render('friends')
  async friends(
    @Headers('authorization') authorization: string,
  ): Promise<{ friends: UserEntity[] }> {
    try {
      const user = await this.userService.getUserFromToken(authorization);
      const friends = await this.userService.findFriendsByNickname(
        user.nickname,
      );
      return {
        friends: friends,
      };
    } catch (err) {}
  }

  @Get()
  @Render('wisher')
  @Public()
  async wisher(
    @Headers('authorization') authorization: string,
  ): Promise<{ wishitem: WishitemEntity; user: UserEntity }> {
    let user;
    try {
      user = await this.userService.getUserFromToken(authorization);
    } catch (err) {
      user = null;
    }

    const item = await this.wisherService.getRandomWishitem();
    return {
      wishitem: item,
      user: user,
    };
  }

  @Get('/wishlists/:id')
  @Render('oneWishlist')
  async getWishlist(
    @Param('id') id: string,
  ): Promise<{ wishitems: WishitemEntity[] }> {
    const wishitems = await this.wishlistService.getWishitemsByWishlistId(id);
    return {
      wishitems: wishitems,
    };
  }

  @Get('/profile')
  @Render('myProfile')
  async getMyProfile(
    @Headers('authorization') authorization: string,
  ): Promise<{ user: UserEntity }> {
    const user = await this.userService.getUserFromToken(authorization);
    return {
      user: user,
    };
  }

  @Get('/items/new')
  @Render('uploadItemToWishlist')
  async uploadItem(): Promise<void> {
    return;
  }

  @Get('/users/:nickname')
  @Render('userProfile')
  async getUserProfile(
    @Headers('authorization') authorization: string,
    @Param('nickname') nickname: string,
  ): Promise<{ user: UserEntity; friendshipState: string }> {
    const guest = await this.userService.getUserFromToken(authorization);
    const host = await this.userService.findOneByNickname(nickname);

    const friendshipState = await this.userService.getUserFriendship(
      guest.nickname,
      host.nickname,
    );

    return {
      user: host,
      friendshipState: FriendRequestState[friendshipState],
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
