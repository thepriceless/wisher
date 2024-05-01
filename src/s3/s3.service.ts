import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismas/prisma.service';
const path = require('path');

@Injectable()
export class S3Service {
  private s3: any;

  constructor(private readonly prismService: PrismaService) {
    const EasyYandexS3 = require('easy-yandex-s3').default;
    this.s3 = new EasyYandexS3({
      auth: {
        accessKeyId: process.env.YANDEX_CLOUD_ID_KEY,
        secretAccessKey: process.env.YANDEX_CLOUD_SECRET_KEY,
      },
      Bucket: 'wisher-images-bucket',
      debug: true,
    });
  }

  async uploadImage(file, folderName) {
    const upload = await this.s3.Upload(
      {
        buffer: file.buffer,
      },
      folderName,
    );
    //console.log(upload);
    return upload.Location;
  }
}
