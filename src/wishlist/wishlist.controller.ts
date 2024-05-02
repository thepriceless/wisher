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
import { NewWishitemDto } from '../wishitem/new.wishitem.dto';
import { UserService } from 'src/user/user.service';
import { S3Service } from 'src/s3/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { WishitemService } from 'src/wishitem/wishitem.service';
import { ApiBody } from '@nestjs/swagger';
import { PrivacyType } from '@prisma/client';
import { WishlistDto } from './wishlist.dto';
import { WishitemDto } from 'src/wishitem/wishitem.dto';
import { WishitemEntity } from 'src/wishitem/wishitem.entity';
import { WishitemMapper } from 'src/wishitem/wishitem.mapper';

@Controller('/api')
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService,
    private readonly wishitemService: WishitemService,
    private readonly userService: UserService,
    private readonly s3service: S3Service,
  ) {}

  //@ApiBody({ type: NewWishitemDto })
  @Post('/wishitems/new')
  @UseInterceptors(FileInterceptor('imageLink'))
  async saveNewItem(
    @Body() newWishitemDto: NewWishitemDto,
    @UploadedFile() itemImage,
    @Headers('authorization') authorization: string,
  ): Promise<WishitemEntity> {
    let imageLink = null;
    if (itemImage !== undefined) {
      imageLink = await this.s3service.uploadImage(
        itemImage,
        process.env.WISHITEM_IMAGE,
      );
    }

    const ownerUser = await this.userService.getUserFromToken(authorization);
    const privacyType =
      PrivacyType[
        newWishitemDto.holderWishlistPrivacy as keyof typeof PrivacyType
      ];

    const wishlist = await this.wishlistService.findWishlistByPrivacyAndOwner(
      privacyType,
      ownerUser.nickname,
    );

    const newWishitem = WishitemMapper.toEntity(newWishitemDto);
    newWishitem.importance = parseInt(newWishitemDto.importance as any);
    newWishitem.wishlistId = wishlist.id;

    const savedWishitem = await this.wishlistService.saveNewItemToWishlist(
      newWishitem,
      imageLink,
    );

    savedWishitem.wishlistId = wishlist.id;

    return savedWishitem;
  }

  @Get('/wishlists')
  async findWishlistByPrivacyAndOwner(
    @Headers('authorization') authorization: string,
    @Query('privacy') privacy: string,
    @Query('owner') owner: string,
  ): Promise<WishlistDto> {
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
  ): Promise<WishitemDto> {
    const user = await this.userService.getUserFromToken(authorization);
    const privacyType =
      PrivacyType[wishlistPrivacy as keyof typeof PrivacyType];

    const wishlist = await this.wishlistService.findWishlistByPrivacyAndOwner(
      privacyType,
      user.nickname,
    );

    const connectedItem =
      await this.wishitemService.connectExistingWishitemToWishlist(
        wishitemId,
        wishlist.id,
      );

    const dto = WishitemMapper.toDto(connectedItem);

    return dto;
  }

  @Delete('/wishitems')
  async deleteItemFromWishlist(
    @Headers('authorization') authorization: string,
    @Query('wishitem') wishitemId: string,
    @Query('wishlist') wishlistId: string,
  ): Promise<WishitemDto> {
    const ownerUser = await this.userService.getUserFromToken(authorization);
    const ownedWishlists =
      await this.wishlistService.getWishlistsByOwner(ownerUser);

    const isOwner = ownedWishlists.some(
      (wishlist) => wishlist.id === wishlistId,
    );

    if (!isOwner) {
      throw new ForbiddenException('Not your wishlist');
    }

    const disconnectedItem =
      await this.wishitemService.disconnectExistingWishitemFromWishlist(
        wishitemId,
        wishlistId,
      );

    const dto = WishitemMapper.toDto(disconnectedItem);

    return dto;
  }
}
