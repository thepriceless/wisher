import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { PrivacyType } from './privacy-type.enum';
import { NewWishitemDto } from './new.wishitem.dto';
import { WishlistEntity } from './wishlist.entity';
import { UserService } from 'src/user/user.service';
import { WishitemEntity } from './wishitem.entity';
import { S3Service } from 'src/s3/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api')
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService,
    private readonly userService: UserService,
    private readonly s3service: S3Service,
  ) {}

  @Post('/wishitems/new')
  @UseInterceptors(FileInterceptor('imageLink'))
  async saveNewItem(
    @Body() newWishitemDto: NewWishitemDto,
    @UploadedFile() itemImage,
  ) {
    console.log('controller file', itemImage);
    console.log('incoming dto', newWishitemDto);
    let imageLink = null;
    if (itemImage !== undefined) {
      imageLink = await this.s3service.uploadImage(
        itemImage,
        process.env.WISHITEM_IMAGE,
      );
    }
    console.log('image link from s3', imageLink);
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

  @Delete('/wishitems')
  async deleteItemFromWishlist(
    @Query('wishitem') wishitemId: string,
    @Query('wishlist') wishlistId: string,
  ): Promise<WishitemEntity> {
    return await this.wishlistService.deleteItemFromWishlist(
      wishitemId,
      wishlistId,
    );
  }
}
