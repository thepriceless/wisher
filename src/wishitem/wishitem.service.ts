import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismas/prisma.service';
import { ObjectStorageImageData } from 'src/s3/image.data';
import { NewWishitemDto } from 'src/wishitem/dto/new.wishitem.dto';
import { WishitemEntity } from 'src/wishitem/wishitem.entity';
import { WishitemMapper } from './wishitem.mapper';

@Injectable()
export class WishitemService {
  constructor(private prisma: PrismaService) {}

  async getRandomWishitem(): Promise<WishitemEntity> {
    const allIds = await this.prisma.wishitem.findMany({
      select: {
        id: true,
      },
    });

    if (allIds.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * allIds.length);
    const randomId = allIds[randomIndex].id;

    const randomWishitem = await this.prisma.wishitem.findUnique({
      where: {
        id: randomId,
      },
      include: {
        itemshopLinks: true,
      },
    });

    return WishitemMapper.toEntityWithSimpleLinks(
      randomWishitem,
      randomWishitem.itemshopLinks,
    );
  }

  async createWishitem(
    wishitem: WishitemEntity,
    imageLink: ObjectStorageImageData,
  ): Promise<WishitemEntity> {
    const itemshopLinks = Array.isArray(wishitem.itemshopLinks)
      ? wishitem.itemshopLinks
      : [];

    let imageLinkUrl = null,
      imageLinkFileName = null;
    if (imageLink !== null) {
      imageLinkUrl = imageLink.location;
      imageLinkFileName = imageLink.fileName;
    }

    return await this.prisma.wishitem.create({
      data: {
        title: wishitem.title,
        importance: wishitem.importance,
        description: wishitem.description,
        imageLink: imageLinkUrl,
        imageLinkAsKey: imageLinkFileName,
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

    return WishitemMapper.toEntityWithSimpleLinks(
      wishitem,
      wishitem.itemshopLinks,
    );
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

  async getWishitemImageLinkByWishitemId(
    wishitemId: string,
  ): Promise<ObjectStorageImageData> {
    const wishitem = await this.getWishitemById(wishitemId);

    return {
      location: wishitem.imageLink,
      fileName: wishitem.imageLinkAsKey,
    };
  }
}
