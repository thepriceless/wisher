import {
  BadRequestException,
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
import { RegisterResponseDto } from './dto/register.response.dto';
import { Public } from './decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/s3/s3.service';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { PrivacyType } from 'src/wishlist/privacy-type.enum';

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
  async login(@Request() req): Promise<LoginResponseDto | BadRequestException> {
    return this.authService.login(req.user);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('photoLink'))
  async register(
    @Body() registerBody: RegisterRequestDto,
    @UploadedFile() profilePhoto,
  ): Promise<RegisterResponseDto> {
    let profilePhotoLink = null;
    if (profilePhoto !== undefined) {
      profilePhotoLink = await this.s3service.uploadImage(
        profilePhoto,
        process.env.PROFILE_PHOTO,
      );
    }

    registerBody.photoLink = profilePhotoLink;

    const userResponse = await this.authService.register(registerBody);

    for (const privacy of Object.values(PrivacyType)) {
      await this.wishlistService.createDefaultWishlist(
        registerBody.nickname,
        privacy,
      );
    }

    return userResponse;
  }
}
