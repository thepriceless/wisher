import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import * as cookie from 'cookie';

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const cookies = cookie.parse(request.headers.cookie || '');
    const accessToken = cookies['accessToken'];
    console.log('accessToken', accessToken);

    // if (accessToken) {
    //   request.headers.authorization = `Bearer ${accessToken}`;
    // }

    return next.handle();
  }
}
