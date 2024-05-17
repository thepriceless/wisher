import { Controller, Get, Headers, Param, Query, Render } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';
import { WishitemEntity } from 'src/wishitem/wishitem.entity';
import { WishitemService } from './wishitem.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { WishitemDto } from './dto/wishitem.dto';
import { WishitemMapper } from './wishitem.mapper';
import { WishitemWithUser } from 'src/types/wishitem.with.user';
import { UserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';

@ApiTags('Wishitem API')
@Controller('/api')
export class WishitemController {
  constructor(
    private readonly userService: UserService,
    private readonly wishitemService: WishitemService,
  ) {}

  @ApiOperation({
    summary: `
    Get random wishitem (that has an image) from all wishitems in database.
  `,
  })
  @ApiOkResponse({
    description: 'Random wishitem is successfully found and returned',
    type: WishitemDto,
  })
  @Get('wisher/random-item')
  async getRandomWishitem(): Promise<WishitemDto> {
    const randomWishitem = await this.wishitemService.getRandomWishitem();

    const dto = WishitemMapper.toDto(randomWishitem);
    return dto;
  }

  @ApiOperation({
    summary: 'Get single wishitem by specified id',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiParam({
    name: 'id',
    description: 'Wishitem id',
    required: true,
  })
  @ApiOkResponse({
    description:
      'Wishitem with specified id is successfully returned with authorized user',
    type: WishitemWithUser,
  })
  @ApiNotFoundResponse({
    description: 'Wishitem with specified id was not found',
  })
  @ApiBearerAuth()
  @Get('/wishitems/:id')
  async getWishitemById(
    @Headers('authorization') authorization: string,
    @Param('id') id: string,
  ): Promise<{ wishitem: WishitemDto }> {
    const wishitem = await this.wishitemService.getWishitemById(id);
    const wishitemDto = WishitemMapper.toDto(wishitem);
    return {
      wishitem: wishitemDto,
    };
  }
}
