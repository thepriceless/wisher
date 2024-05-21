import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as hbs from 'hbs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { JwtExceptionFilter } from './auth/exception-filters/json-web-token.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.useGlobalFilters(new JwtExceptionFilter());

  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  hbs.registerHelper('eq', function (a: string, b: string) {
    return a === b;
  });
  hbs.registerHelper('privacyToId', function (privacy) {
    switch (privacy) {
      case 'PUBLIC':
        return 'public-wishlist__as-id';
      case 'FRIENDS':
        return 'friends-wishlist__as-id';
      case 'PRIVATE':
        return 'private-wishlist__as-id';
      default:
        return '';
    }
  });
  hbs.registerHelper('range', function (start, end) {
    const array = [];
    for (let i = start; i < end; i++) {
      array.push(i);
    }
    return array;
  });
  hbs.registerHelper('lte', function (a, b) {
    return a <= b;
  });
  hbs.registerHelper('addOne', function (number) {
    return number + 1;
  });
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Wisher')
    .setDescription('Application holding wishlists')
    .setVersion('1.0')
    .addTag('wisher')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      disableErrorMessages: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = configService.get('PORT') || 2024;
  await app.listen(port);
}
bootstrap();
