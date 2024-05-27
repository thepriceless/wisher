import {
  HttpStatus,
  ParseFilePipeBuilder,
  HttpException,
} from '@nestjs/common';

export const profilePhotoSizeValidation = new ParseFilePipeBuilder()
  .addMaxSizeValidator({
    maxSize: 10_000_000,
  })
  .build({
    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    fileIsRequired: false,
    exceptionFactory: (_) =>
      new HttpException('Max file size reached', HttpStatus.BAD_REQUEST),
  });

export const profilePhotoExtensionValidation = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: '.(png|jpeg|jpg)',
  })
  .build({
    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    fileIsRequired: false,
    exceptionFactory: (_) =>
      new HttpException('Incorrect file extension', HttpStatus.BAD_REQUEST),
  });
