import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WishesModule } from './wishes/wishes.module';

@Module({
  imports: [ConfigModule.forRoot(), WishesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
