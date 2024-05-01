import { Module } from '@nestjs/common';
import { WisherController } from './wisher.controller';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { WisherService } from './wisher.service';
import { PrismaModule } from 'src/prismas/prisma.module';
import { UserModule } from 'src/user/user.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  controllers: [WisherController, WishlistController],
  providers: [WishlistService, WisherService],
  imports: [PrismaModule, UserModule, S3Module],
  exports: [WisherService, WishlistService],
})
export class WishesModule {}
