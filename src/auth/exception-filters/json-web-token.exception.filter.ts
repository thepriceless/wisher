import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const pathToRedirectionHtml = path.join(
  __dirname,
  '../../../public/html',
  'access-denied-redirection.html',
);

@Catch(JsonWebTokenError)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: JsonWebTokenError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(401).sendFile(pathToRedirectionHtml);
  }
}
