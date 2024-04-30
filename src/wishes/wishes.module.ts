import { Module } from '@nestjs/common';
import { WisherController } from './wisher.controller';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { WisherService } from './wisher.service';
import { PrismaModule } from 'src/prismas/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [WisherController, WishlistController],
  providers: [WishlistService, WisherService],
  imports: [PrismaModule, UserModule],
  exports: [WisherService, WishlistService],
})
export class WishesModule {}
