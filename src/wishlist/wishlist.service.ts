import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismas/prisma.service';
import { WishlistEntity } from './wishlist.entity';
import { UserEntity } from 'src/user/user.entity';
import { WishitemEntity } from '../wishitem/wishitem.entity';
import { NewWishitemDto } from '../wishitem/dto/new.wishitem.dto';
import { WishitemService } from 'src/wishitem/wishitem.service';
import { PrivacyType } from '@prisma/client';
import { ObjectStorageImageData } from 'src/s3/image.data';

@Injectable()
export class WishlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wishitemService: WishitemService,
  ) {}

  async getWishlistsByOwner(owner: UserEntity): Promise<WishlistEntity[]> {
    const wishlistsByUser = await this.prisma.wishlist.findMany({
      where: {
        ownerNickname: owner.nickname,
      },
    });

    const reorderedWishlists = wishlistsByUser.sort((a, b) => {
      const order = ['PUBLIC', 'FRIENDS', 'PRIVATE'];
      return order.indexOf(a.privacy) - order.indexOf(b.privacy);
    });

    return reorderedWishlists;
  }

  async getWishitemsByWishlistId(
    wishlistId: string,
  ): Promise<WishitemEntity[]> {
    const wishlistWithWishitems = await this.prisma.wishlist.findUnique({
      where: {
        id: wishlistId,
      },
      include: {
        wishitems: true,
      },
    });

    return wishlistWithWishitems.wishitems;
  }

  async saveNewItemToWishlist(
    wishitem: WishitemEntity,
    imageLink: ObjectStorageImageData,
  ) {
    const newWishitem = await this.wishitemService.createWishitem(
      wishitem,
      imageLink,
    );

    const wishitemWithWishlist =
      this.wishitemService.connectExistingWishitemToWishlist(
        newWishitem.id,
        wishitem.wishlistId,
      );

    return wishitemWithWishlist;
  }

  async findWishlistByPrivacyAndOwner(
    privacy: PrivacyType,
    ownerNickname: string,
  ): Promise<WishlistEntity> {
    const wishlists = await this.prisma.wishlist.findMany({
      where: {
        privacy: privacy,
        ownerNickname: ownerNickname,
      },
    });

    return wishlists[0];
  }

  async createDefaultWishlist(
    ownerNickname: string,
    privacy: PrivacyType,
  ): Promise<WishlistEntity> {
    const user = await this.prisma.user.findUnique({
      where: { nickname: ownerNickname },
    });

    if (!user) {
      throw new Error(`User with nickname ${ownerNickname} not found`);
    }

    const wishlist = await this.prisma.wishlist.create({
      data: {
        title: privacy,
        owner: {
          connect: { nickname: ownerNickname },
        },
        privacy: privacy,
      },
    });

    return wishlist;
  }
}
