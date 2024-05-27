import { Controller, Get, Headers, Param, Query, Res } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { S3Service } from 'src/s3/s3.service';
import { WishitemDto } from 'src/wishitem/dto/wishitem.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Wishlist API')
@Controller('/api')
export class S3Controller {
  constructor(private readonly s3service: S3Service) {}

  @ApiOperation({
    summary: `
      Get wishlist with specified privacy of user with specified nickname
    `,
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiQuery({
    name: 'privacy',
    description: 'Privacy type of wishlist',
    type: String,
  })
  @ApiQuery({
    name: 'owner',
    description: 'Nickname of wishlist owner',
    type: String,
  })
  @ApiOkResponse({
    description:
      'Wishlist with specified privacy of user with specified nickname is returned',
    type: WishitemDto,
  })
  @ApiNotFoundResponse({
    description:
      'Wishlist with specified privacy of user with specified nickname is not found',
  })
  @ApiBearerAuth()
  @Get('/images/:key')
  async getImageFromStorage(
    @Headers('authorization') authorization: string,
    @Param('key') imageKeyName: string,
    @Query('imagekind') imageType: string,
    @Res() res: Response,
  ) {
    const folder = process.env[imageType];
    const imageData = await this.s3service.downloadImageBuffer(
      folder,
      imageKeyName,
    );

    res.setHeader('Content-Type', imageData.ContentType);
    res.send(imageData.Body);
  }
}
