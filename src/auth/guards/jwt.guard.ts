import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

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

  handleRequest(err, user, info, context: ExecutionContext, status) {
    if (err || !user) {
      const httpContext = context.switchToHttp();
      const response = httpContext.getResponse<Response>();
      console.log('info', info);
      const unauthorizedHtmlFilePath ='C:\\Education\\web\\wisher\\src\\auth\\guards\\err.html';
      console.log('filePath', unauthorizedHtmlFilePath);
      response.status(401).sendFile(unauthorizedHtmlFilePath);
      return;
    }

    return user;
  }
}
