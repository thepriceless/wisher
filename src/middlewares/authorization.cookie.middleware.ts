import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as cookie from 'cookie';

@Injectable()
export class AuthorizationCookieMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('AuthorizationCookieMiddleware');
    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const accessToken = cookies['AccessToken'];

      console.log('accessToken', accessToken);

      if (accessToken) {
        req.headers.authorization = `Bearer ${accessToken}`;
      }

      console.log('req.headers.authorization', req.headers);
    } catch (error) {
      //console.error(error);
    }

    next();
  }
}
