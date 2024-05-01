import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismas/prisma.service';
import { WishlistEntity } from './wishlist.entity';
import { UserEntity } from 'src/user/user.entity';
import { WishitemEntity } from './wishitem.entity';
import { PrivacyType } from './privacy-type.enum';
import { NewWishitemDto } from './new.wishitem.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

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

  async saveNewItemToWishlist(wishitem: NewWishitemDto) {
    const itemshopLinks = Array.isArray(wishitem.itemshopLinks)
      ? wishitem.itemshopLinks
      : [];

    const newWishitem = await this.prisma.wishitem.create({
      data: {
        title: wishitem.title,
        importance: wishitem.importance,
        description: wishitem.description,
        imageLink: wishitem.imageLink,
        itemshopLinks: {
          create: itemshopLinks.map((link) => {
            return {
              link: link,
            };
          }),
        },
      },
    });

    const wishitemWithWishlist = this.connectExistingWishitemToWishlist(
      newWishitem.id,
      wishitem.wishlistId,
    );

    return wishitemWithWishlist;
  }

  async connectExistingWishitemToWishlist(
    wishitemId: string,
    wishlistId: string,
  ): Promise<WishitemEntity> {
    const linkedWishitem = await this.prisma.wishitem.update({
      where: {
        id: wishitemId,
      },
      data: {
        wishlists: {
          connect: {
            id: wishlistId,
          },
        },
      },
    });

    return linkedWishitem;
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

  async getWishitemById(id: string): Promise<WishitemEntity> {
    const wishitem = await this.prisma.wishitem.findUnique({
      where: {
        id: id,
      },
      include: {
        itemshopLinks: true,
      },
    });

    return wishitem;
  }

  async deleteItemFromWishlist(
    wishitemId: string,
    wishlistId: string,
  ): Promise<WishitemEntity> {
    const deletedWishitem = await this.prisma.wishitem.update({
      where: {
        id: wishitemId,
      },
      data: {
        wishlists: {
          disconnect: {
            id: wishlistId,
          },
        },
      },
    });

    return deletedWishitem;
  }
}
