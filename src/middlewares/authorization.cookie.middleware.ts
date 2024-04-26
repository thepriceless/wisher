import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as cookie from 'cookie';

@Injectable()
export class AuthorizationCookieMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const accessToken = cookies['AccessToken'];
      if (accessToken) {
        req.headers.authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      // console.error(error);
    }
    next();
  }
}
