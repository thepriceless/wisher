import { Wishitem } from '@prisma/client';

export class WishitemEntity implements Wishitem {
  id: string;
  title: string;
  description: string;
  importance: number;
  imageLink: string;
}
