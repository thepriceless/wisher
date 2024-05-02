import { Controller, Get } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';
import { WishitemEntity } from 'src/wishitem/wishitem.entity';
import { WishitemService } from './wishitem.service';

@Controller('/api')
export class WishitemController {
  constructor(
    private readonly s3service: S3Service,
    private readonly wishitemService: WishitemService,
  ) {}

  @Get('wisher/random-item')
  async getRandomWishitem(): Promise<WishitemEntity> {
    return await this.wishitemService.getRandomWishitem();
  }
}
