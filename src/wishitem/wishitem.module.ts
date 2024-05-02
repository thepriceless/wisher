import { Module } from '@nestjs/common';
import { WishitemService } from './wishitem.service';
import { PrismaModule } from 'src/prismas/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WishitemService],
  exports: [WishitemService],
})
export class WishitemModule {}
