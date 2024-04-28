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
import { UtiliesForControllers } from './utility/controllers.common';
import { WishlistService } from './wishes/wishlist.service';

@Controller()
@UseInterceptors(TimeInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly wisherService: WisherService,
    private readonly wishlistService: WishlistService,
    private readonly userService: UserService,
    private readonly utilities: UtiliesForControllers,
  ) {}
  @Get('/wishlists')
  @Render('myWishlists')
  async myWishlist(@Headers('authorization') authorization: string) {
    try {
      const user = await this.utilities.getUserFromToken(authorization);
      // console.log('user ', user);
      const wishlists = await this.wishlistService.getWishlistsByOwner(user);
      // console.log('wishlists ', wishlists);
      return {
        wishlists: wishlists,
      };
    } catch (err) {}
  }

  @Get('/friends')
  @Render('friends')
  async friends(@Headers('authorization') authorization: string) {
    try {
      const user = await this.utilities.getUserFromToken(authorization);
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
      user = await this.utilities.getUserFromToken(authorization);
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
  async getWishlist(@Param('id') id: string) {
    const wishitems = await this.wishlistService.getWishitemsByWishlistId(id);
    return {
      wishitems: wishitems,
    };
  }

  @Get('/auth/login')
  @Render('login')
  @Public()
  async login() {
    return;
  }

  @Get('/auth/register')
  @Render('register')
  @Public()
  async register() {
    return;
  }
}
