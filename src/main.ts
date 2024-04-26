import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 2024;
  await app.listen(port);
}
bootstrap();
