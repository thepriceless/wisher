import { Controller, Get } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';
import { WishitemEntity } from 'src/wishitem/wishitem.entity';
import { WishitemService } from './wishitem.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WishitemDto } from './dto/wishitem.dto';
import { WishitemMapper } from './wishitem.mapper';

@ApiTags('Wishitem API')
@Controller('/api')
export class WishitemController {
  constructor(
    private readonly s3service: S3Service,
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
}
