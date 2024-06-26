import {
  HttpException,
  HttpStatus,
  ParseFilePipeBuilder,
} from '@nestjs/common';

export const wishitemImageSizeValidation = new ParseFilePipeBuilder()
  .addMaxSizeValidator({
    maxSize: 4_000_000,
  })
  .build({
    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    fileIsRequired: false,
    exceptionFactory: (_) =>
      new HttpException('Max file size reached', HttpStatus.BAD_REQUEST),
  });

export const wishitemImageExtensionValidation = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: '.(png|jpeg|jpg)',
  })
  .build({
    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    fileIsRequired: false,
    exceptionFactory: (_) =>
      new HttpException('Incorrect file extension', HttpStatus.BAD_REQUEST),
  });
