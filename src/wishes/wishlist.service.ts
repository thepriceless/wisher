import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismas/prisma.service';
import { WishlistEntity } from './wishlist.entity';
import { UserEntity } from 'src/user/user.entity';
import { WishitemEntity } from './wishitem.entity';

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
    console.log('wishlistId ', wishlistId);
    const wishlistWithWishitems = await this.prisma.wishlist.findUnique({
      where: {
        id: wishlistId,
      },
      include: {
        wishitems: true,
      },
    });

    console.log('wishlistWithWishitems ', wishlistWithWishitems.wishitems);

    return wishlistWithWishitems.wishitems;
  }
}
