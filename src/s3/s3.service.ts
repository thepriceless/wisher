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
      debug: false,
    });
  }

  async uploadImage(file, folderName) {
    const upload = await this.s3.Upload(
      {
        buffer: file.buffer,
      },
      folderName,
    );

    return upload.Location;
  }

  async downloadImageBuffer(path: string): Promise<string> {
    const download = await this.s3.Download(path);
    // console.log(download);
    return download.body;
  }
}
