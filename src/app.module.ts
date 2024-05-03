import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WishlistModule } from './wishlist/wishlist.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { AuthorizationCookieMiddleware } from './middlewares/authorization.cookie.middleware';
import { S3Module } from './s3/s3.module';
import { WishitemController } from './wishitem/wishitem.controller';
import { WishitemModule } from './wishitem/wishitem.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WishlistModule,
    AuthModule,
    UserModule,
    S3Module,
    WishitemModule,
    WebsocketModule,
  ],
  controllers: [AppController, WishitemController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationCookieMiddleware).forRoutes('*');
  }
}
