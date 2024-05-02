import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterRequestDto } from 'src/auth/dto/register.request.dto';
import { LoginResponseDto } from './dto/login.response.dto';
import { Public } from './decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/s3/s3.service';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { UserEntity } from 'src/user/user.entity';
import { PrivacyType } from '@prisma/client';

@Public()
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly wishlistService: WishlistService,
    private readonly s3service: S3Service,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<LoginResponseDto> {
    const accessToken = await this.authService.login(req.user);
    return { accessToken: accessToken };
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('photoLink'))
  async register(
    @Body() registerBody: RegisterRequestDto,
    @UploadedFile() profilePhoto,
  ): Promise<LoginResponseDto> {
    const userEntity = new UserEntity(registerBody);

    if (profilePhoto !== undefined) {
      const imageData = await this.s3service.uploadImage(
        profilePhoto,
        process.env.PROFILE_PHOTO,
      );
      userEntity.photoLink = imageData.location;
      userEntity.photoLinkAsKey = imageData.path;
    }

    const accessToken = await this.authService.register(userEntity);

    for (const privacy of Object.values(PrivacyType)) {
      await this.wishlistService.createDefaultWishlist(
        registerBody.nickname,
        privacy,
      );
    }

    return { accessToken: accessToken };
  }
}
