import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { PrismaModule } from 'src/prismas/prisma.module';

@Module({
  providers: [S3Service],
  imports: [PrismaModule],
  exports: [S3Service],
})
export class S3Module {}
