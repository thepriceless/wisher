import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SECONDS_IN_A_DAY } from 'src/constants';
import { S3Module } from 'src/s3/s3.module';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [
    UserModule,
    S3Module,
    WishesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn:
            parseInt(process.env.ACCESS_TOKEN_VALIDITY_DURATION_DAYS) *
            SECONDS_IN_A_DAY,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
