import { Module } from '@nestjs/common';
import { WisherController } from './wisher.controller';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { WisherService } from './wisher.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [WisherController, WishlistController],
  providers: [WishlistService, WisherService, PrismaService],
  exports: [WisherService],
})
export class WishesModule {}
