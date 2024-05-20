import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { PrismaModule } from 'src/prismas/prisma.module';
import { S3Controller } from './s3.controller';

@Module({
  controllers: [S3Controller],
  providers: [S3Service],
  imports: [PrismaModule],
  exports: [S3Service],
})
export class S3Module {}
