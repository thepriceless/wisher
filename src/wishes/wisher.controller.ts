import { Controller, Get } from '@nestjs/common';
import { WisherService } from './wisher.service';
import { WishitemEntity } from './wishitem.entity';

@Controller('/api')
export class WisherController {
  constructor(private readonly wisherService: WisherService) {}
  @Get('wisher/random-item')
  async getRandomWishitem(): Promise<WishitemEntity> {
    return await this.wisherService.getRandomWishitem();
  }
}
