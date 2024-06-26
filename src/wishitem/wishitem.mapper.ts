import { WishitemEntity } from './wishitem.entity';
import { WishitemDto } from './dto/wishitem.dto';
import { NewWishitemDto } from './dto/new.wishitem.dto';

export class WishitemMapper {
  static toDto(wishitemEntity: WishitemEntity): WishitemDto {
    return {
      id: wishitemEntity.id,
      title: wishitemEntity.title,
      description: wishitemEntity.description,
      importance: wishitemEntity.importance,
      wishlistId: wishitemEntity.wishlistId,
      imageLink: wishitemEntity.imageLink,
      imageLinkAsKey: wishitemEntity.imageLinkAsKey,
      itemshopLinks: wishitemEntity.itemshopLinks,
    };
  }

  static toEntity(newWishitemDto: NewWishitemDto): WishitemEntity {
    return {
      id: undefined,
      title: newWishitemDto.title,
      description: newWishitemDto.description,
      importance: newWishitemDto.importance,
      imageLink: undefined,
      imageLinkAsKey: undefined,
      itemshopLinks: newWishitemDto.itemshopLinks,
    };
  }

  static toEntityWithSimpleLinks(
    wishitemEntityWithLinkObjects,
    itemshopLinks,
  ): WishitemEntity {
    const itemshopLinksNoId = itemshopLinks.map(
      (linkObject) => linkObject.link,
    );

    return {
      id: wishitemEntityWithLinkObjects.id,
      title: wishitemEntityWithLinkObjects.title,
      description: wishitemEntityWithLinkObjects.description,
      importance: wishitemEntityWithLinkObjects.importance,
      imageLink: wishitemEntityWithLinkObjects.imageLink,
      imageLinkAsKey: wishitemEntityWithLinkObjects.imageLinkAsKey,
      itemshopLinks: itemshopLinksNoId,
    };
  }
}
