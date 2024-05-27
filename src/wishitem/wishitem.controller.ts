import { Controller, Get, Param } from '@nestjs/common';
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
import { UserService } from 'src/user/user.service';
import { Public } from 'src/auth/decorators/public.decorator';

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
  @Public()
  @Get('wisher/random-item')
  async getRandomWishitem(): Promise<{ wishitem: WishitemDto }> {
    const randomWishitem = await this.wishitemService.getRandomWishitem();
    const wishitemDto = WishitemMapper.toDto(randomWishitem);

    return {
      wishitem: wishitemDto,
    };
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
    @Param('id') id: string,
  ): Promise<{ wishitem: WishitemDto }> {
    const wishitem = await this.wishitemService.getWishitemById(id);
    const wishitemDto = WishitemMapper.toDto(wishitem);
    return {
      wishitem: wishitemDto,
    };
  }
}
