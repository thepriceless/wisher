import {
  Controller,
  Get,
  Headers,
  Render,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { TimeInterceptor } from './interceptors/time.interceptor';
import { WishitemEntity } from './wishes/wishitem.entity';
import { WisherService } from './wishes/wisher.service';
import { Public } from './auth/decorators/public.decorator';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { UserEntity } from './user/user.entity';
import * as jwt from 'jsonwebtoken';
import { UserService } from './user/user.service';

@Controller()
@UseInterceptors(TimeInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly wisherService: WisherService,
    private readonly userService: UserService,
  ) {}
  @Get('/my-wishlist')
  @Render('myWishlist')
  myWishlist() {
    return;
  }

  @Get('/friends')
  @Render('friends')
  friends() {
    return;
  }

  @Get()
  @Render('wisher')
  @Public()
  async wisher(
    @Headers('authorization') authorization: string,
  ): Promise<{ wishitem: WishitemEntity; user: UserEntity }> {
    let user;
    try {
      const token = authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (typeof decodedToken === 'object' && 'nickname' in decodedToken) {
        const nickname = JSON.stringify(decodedToken.nickname).slice(1, -1);
        user = await this.userService.findOneByNickname(nickname);
      }
    } catch (err) {
      user = null;
    }

    const item = await this.wisherService.getRandomWishitem();
    return {
      wishitem: item,
      user: user,
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
