import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterRequestDto } from 'src/auth/dto/register.request.dto';
import { LoginResponseDto } from './dto/login.response.dto';
import { RegisterResponseDto } from './dto/register.response.dto';
import { Public } from './decorators/public.decorator';

@Public()
@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<LoginResponseDto | BadRequestException> {
    // console.log('controller login ', req.user);
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDto,
  ): Promise<RegisterResponseDto | BadRequestException> {
    // console.log('controller ', registerBody);
    return await this.authService.register(registerBody);
  }
}
