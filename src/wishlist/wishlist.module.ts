import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { PrismaModule } from 'src/prismas/prisma.module';
import { UserModule } from 'src/user/user.module';
import { S3Module } from 'src/s3/s3.module';
import { WishitemModule } from 'src/wishitem/wishitem.module';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService],
  imports: [PrismaModule, UserModule, S3Module, WishitemModule],
  exports: [WishlistService],
})
export class WishlistModule {}
