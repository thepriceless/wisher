import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismas/prisma.service';
import { NewWishitemDto } from 'src/wishitem/new.wishitem.dto';
import { WishitemEntity } from 'src/wishitem/wishitem.entity';

@Injectable()
export class WishitemService {
  constructor(private prisma: PrismaService) {}

  async getRandomWishitem(): Promise<WishitemEntity> {
    const allIds = await this.prisma.wishitem.findMany({
      where: {
        imageLink: {
          not: null,
        },
      },
      select: {
        id: true,
      },
    });

    if (allIds.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * allIds.length);
    const randomId = allIds[randomIndex].id;

    return this.prisma.wishitem.findUnique({
      where: {
        id: randomId,
      },
    });
  }

  async createWishitem(
    wishitem: NewWishitemDto,
    imageLink: string,
  ): Promise<WishitemEntity> {
    const itemshopLinks = Array.isArray(wishitem.itemshopLinks)
      ? wishitem.itemshopLinks
      : [];

    return await this.prisma.wishitem.create({
      data: {
        title: wishitem.title,
        importance: wishitem.importance,
        description: wishitem.description,
        imageLink: imageLink,
        itemshopLinks: {
          create: itemshopLinks.map((link) => {
            return {
              link: link,
            };
          }),
        },
      },
    });
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

  async disconnectExistingWishitemFromWishlist(
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
