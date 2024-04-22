import { Controller, Get } from '@nestjs/common';
import { WisherService } from './wisher.service';
import { WishitemEntity } from './wishitem.entity';

@Controller('wisher/random-item')
export class WisherController {
  constructor(private readonly wisherService: WisherService) {}
  @Get()
  async getRandomWishitem(): Promise<WishitemEntity> {
    return await this.wisherService.getRandomWishitem();
  }
}
