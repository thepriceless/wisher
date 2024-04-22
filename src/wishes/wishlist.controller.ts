import { Controller, Get, Render } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller("")
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}
  @Get()
  @Render('')
  root() {
    return;
  }
}
