import { Injectable } from '@nestjs/common';
import { WishitemEntity } from './wishitem.entity';
import { PrismaService } from 'src/prismas/prisma.service';

@Injectable()
export class WisherService {
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

    return this.prisma.wishitem.findUnique({
      where: {
        id: randomId,
      },
    });
  }
}
