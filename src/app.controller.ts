import { Controller, Get, Render, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TimeInterceptor } from './interceptors/time.interceptor';
import { WishitemEntity } from './wishes/wishitem.entity';
import { WisherService } from './wishes/wisher.service';
import { Public } from './auth/decorators/public.decorator';

@Controller()
@UseInterceptors(TimeInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly wisherService: WisherService,
  ) {}
  @Get('/my-wishlist')
  @Render('myWishlist')
  myWishlist() {
    return;
  }

  @Get('/friends')
  @Render('friends')
  friends() {
    console.log('friends');
  }

  @Get()
  @Render('wisher')
  @Public()
  async wisher(): Promise<WishitemEntity> {
    const item = await this.wisherService.getRandomWishitem();
    return {
      title: item.title,
      description: item.description,
      importance: item.importance,
      id: item.id,
      imageLink: item.imageLink,
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
