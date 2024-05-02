import { WishitemEntity } from './wishitem.entity';

export class WishitemDto {
  id: string;
  title: string;
  description: string;
  importance: number;
  wishlistId: string;
  imageLink: string;
  itemshopLinks?: string[];
}
