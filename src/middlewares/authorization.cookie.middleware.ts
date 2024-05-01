import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as cookie from 'cookie';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthorizationCookieMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const accessToken = `Bearer ${cookies['AccessToken']}`;
      if (accessToken) {
        req.headers.authorization = accessToken;
      }
    } catch (error) {
      console.error(error);
    }
    next();
  }
}
