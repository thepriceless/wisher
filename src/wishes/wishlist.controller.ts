import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Render,
  Request,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { PrivacyType } from './privacy-type.enum';
import { NewWishitemDto } from './new.wishitem.dto';
import { WishlistEntity } from './wishlist.entity';
import { UserService } from 'src/user/user.service';

@Controller('/api')
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService,
    private readonly userService: UserService,
  ) {}
  @Post('/items/new')
  async saveNewItem(@Body() newWishitemDto: NewWishitemDto) {
    console.log('newWishitemDto ', newWishitemDto);
    newWishitemDto.importance = parseInt(newWishitemDto.importance as any);
    return await this.wishlistService.saveNewItemToWishlist(newWishitemDto);
  }

  @Post('/wishlists/by-privacy-owner')
  async findWishlistByPrivacyAndOwner(
    @Headers('authorization') authorization: string,
    @Body() body,
  ): Promise<WishlistEntity> {
    const owner = await this.userService.getUserFromToken(authorization);

    const privacy = body.privacy;
    const privacyType = PrivacyType[privacy as keyof typeof PrivacyType];
    return await this.wishlistService.findWishlistByPrivacyAndOwner(
      privacyType,
      owner.nickname,
    );
  }
}
