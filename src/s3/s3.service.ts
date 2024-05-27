import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismas/prisma.service';
import { ObjectStorageImageData } from './image.data';

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

  async uploadImage(file, folderName): Promise<ObjectStorageImageData> {
    const upload = await this.s3.Upload(
      {
        buffer: file.buffer,
      },
      folderName,
    );

    const lastSlashIndex = upload.key.lastIndexOf('/');
    const fileName = upload.key.substring(lastSlashIndex + 1);

    return {
      location: upload.Location,
      fileName: fileName,
    };
  }

  async downloadImageBuffer(folderName: string, imageKey: string) {
    const path = `${folderName}${imageKey}`;
    const download = await this.s3.Download(path);
    return download.data;
  }
}
