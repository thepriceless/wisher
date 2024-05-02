import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { PrivacyType } from './privacy-type.enum';
import { NewWishitemDto } from '../wishitem/new.wishitem.dto';
import { WishlistEntity } from './wishlist.entity';
import { UserService } from 'src/user/user.service';
import { WishitemEntity } from '../wishitem/wishitem.entity';
import { S3Service } from 'src/s3/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { WishitemService } from 'src/wishitem/wishitem.service';

@Controller('/api')
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService,
    private readonly wishitemService: WishitemService,
    private readonly userService: UserService,
    private readonly s3service: S3Service,
  ) {}

  @Post('/wishitems/new')
  @UseInterceptors(FileInterceptor('imageLink'))
  async saveNewItem(
    @Body() newWishitemDto: NewWishitemDto,
    @UploadedFile() itemImage,
  ) {
    let imageLink = null;
    if (itemImage !== undefined) {
      imageLink = await this.s3service.uploadImage(
        itemImage,
        process.env.WISHITEM_IMAGE,
      );
    }

    newWishitemDto.importance = parseInt(newWishitemDto.importance as any);
    return await this.wishlistService.saveNewItemToWishlist(
      newWishitemDto,
      imageLink,
    );
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

  @Post('wisher/:id')
  async connectExistingWishitemToWishlist(
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

    return await this.wishitemService.connectExistingWishitemToWishlist(
      wishitemId,
      wishlist.id,
    );
  }

  @Delete('/wishitems')
  async deleteItemFromWishlist(
    @Headers('authorization') authorization: string,
    @Query('wishitem') wishitemId: string,
    @Query('wishlist') wishlistId: string,
  ): Promise<WishitemEntity> {
    const ownerUser = await this.userService.getUserFromToken(authorization);
    const ownedWishlists =
      await this.wishlistService.getWishlistsByOwner(ownerUser);

    const isOwner = ownedWishlists.some(
      (wishlist) => wishlist.id === wishlistId,
    );

    if (!isOwner) {
      throw new ForbiddenException('Not your wishlist');
    }

    return await this.wishitemService.disconnectExistingWishitemFromWishlist(
      wishitemId,
      wishlistId,
    );
  }
}
