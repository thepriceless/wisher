import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismas/prisma.service';
import { ObjectStorageImageData } from 'src/s3/image.data';
import { NewWishitemDto } from 'src/wishitem/dto/new.wishitem.dto';
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

    const randomWishitem = await this.prisma.wishitem.findUnique({
      where: {
        id: randomId,
      },
      include: {
        itemshopLinks: true,
      },
    });

    const itemshopLinksNoId = randomWishitem.itemshopLinks.map(
      (linkObject) => linkObject.link,
    );

    const wishitemRes: WishitemEntity = new WishitemEntity();
    wishitemRes.id = randomWishitem.id;
    wishitemRes.title = randomWishitem.title;
    wishitemRes.description = randomWishitem.description;
    wishitemRes.importance = randomWishitem.importance;
    wishitemRes.imageLink = randomWishitem.imageLink;
    wishitemRes.imageLinkAsKey = randomWishitem.imageLinkAsKey;
    wishitemRes.itemshopLinks = itemshopLinksNoId;

    return wishitemRes;
  }

  async createWishitem(
    wishitem: WishitemEntity,
    imageLink: ObjectStorageImageData,
  ): Promise<WishitemEntity> {
    const itemshopLinks = Array.isArray(wishitem.itemshopLinks)
      ? wishitem.itemshopLinks
      : [];

    const imageLinkUrl = imageLink !== null ? imageLink.location : null;

    return await this.prisma.wishitem.create({
      data: {
        title: wishitem.title,
        importance: wishitem.importance,
        description: wishitem.description,
        imageLink: imageLinkUrl,
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

    const itemshopLinksNoId = wishitem.itemshopLinks.map(
      (linkObject) => linkObject.link,
    );

    const wishitemRes: WishitemEntity = new WishitemEntity();
    wishitemRes.id = wishitem.id;
    wishitemRes.title = wishitem.title;
    wishitemRes.description = wishitem.description;
    wishitemRes.importance = wishitem.importance;
    wishitemRes.imageLink = wishitem.imageLink;
    wishitemRes.imageLinkAsKey = wishitem.imageLinkAsKey;
    wishitemRes.itemshopLinks = itemshopLinksNoId;

    console.log(wishitemRes);

    return wishitemRes;
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
      path: wishitem.imageLinkAsKey,
    };
  }
}
