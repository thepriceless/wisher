import { Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { WisherService } from './wisher.service';
import { WishitemEntity } from './wishitem.entity';
import { WishlistService } from './wishlist.service';
import { UserService } from 'src/user/user.service';
import { PrivacyType } from './privacy-type.enum';

@Controller('/api')
export class WisherController {
  constructor(
    private readonly wisherService: WisherService,
    private readonly wishlistService: WishlistService,
    private readonly userService: UserService,
  ) {}
  @Get('wisher/random-item')
  async getRandomWishitem(): Promise<WishitemEntity> {
    return await this.wisherService.getRandomWishitem();
  }

  @Post('wisher/:id')
  async addWishitemToWishlist(
    @Param('id') wishitemId: string,
    @Query('privacy') wishlistPrivacy: string,
    @Headers('authorization') authorization: string,
  ): Promise<WishitemEntity> {
    const user = await this.userService.getUserFromToken(authorization);
    const privacyType =
      PrivacyType[wishlistPrivacy as keyof typeof PrivacyType];

    const wishlist = await this.wishlistService.findWishlistByPrivacyAndOwner(
      privacyType,
      user.nickname,
    );

    return await this.wishlistService.connectExistingWishitemToWishlist(
      wishitemId,
      wishlist.id,
    );
  }
}
