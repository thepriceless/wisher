import { Controller, Get, Render, UseInterceptors } from "@nestjs/common";
import { AppService } from './app.service';
import { TimeInterceptor } from "./interceptors/time.interceptor";

@Controller()
@UseInterceptors(TimeInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  @Render('index')
  root() {
    return;
  }

  @Get("/my-wishlist")
  @Render('myWishlist')
  myWishlist() {
    return;
  }

  @Get("/friends")
  @Render('friends')
  friends() {
    return;
  }
}
