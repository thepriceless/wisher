import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
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
    newWishitemDto.importance = parseInt(newWishitemDto.importance as any);
    return await this.wishlistService.saveNewItemToWishlist(newWishitemDto);
  }

  @Get('/wishlists')
  async findWishlistByPrivacyAndOwner(
    @Headers('authorization') authorization: string,
    @Query('privacy') privacy: string,
    @Query('owner') owner: string,
  ): Promise<WishlistEntity> {
    let ownerNickname: string;
    if (owner) {
      ownerNickname = owner;
    } else {
      const ownerUser = await this.userService.getUserFromToken(authorization);
      ownerNickname = ownerUser.nickname;
    }

    const privacyType = PrivacyType[privacy as keyof typeof PrivacyType];

    return await this.wishlistService.findWishlistByPrivacyAndOwner(
      privacyType,
      ownerNickname,
    );
  }
}
