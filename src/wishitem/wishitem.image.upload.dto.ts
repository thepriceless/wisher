import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class WishitemImageUploadDto {
  @Matches(/image\/(png|jpeg|jpg)/, {
    message: 'File must be a JPEG or PNG image',
  })
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
