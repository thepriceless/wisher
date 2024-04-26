import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const pathToRedirectionHtml = path.join(
  __dirname,
  '../../../public/html',
  'access-denied-redirection.html',
);

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      const httpContext = context.switchToHttp();
      const response = httpContext.getResponse<Response>();
      console.log('info', info);
      response.status(401).sendFile(pathToRedirectionHtml);
      return;
    }

    return user;
  }
}
