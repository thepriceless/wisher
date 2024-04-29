import { Module } from '@nestjs/common';
import { WisherController } from './wisher.controller';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { WisherService } from './wisher.service';
import { PrismaModule } from 'src/prismas/prisma.module';
import { UtilityModule } from 'src/utility/utility.module';

@Module({
  controllers: [WisherController, WishlistController],
  providers: [WishlistService, WisherService],
  imports: [PrismaModule, UtilityModule],
  exports: [WisherService, WishlistService],
})
export class WishesModule {}
