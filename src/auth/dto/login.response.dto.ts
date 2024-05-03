import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class LoginResponseDto {
  @IsJWT()
  @ApiProperty({
    description: 'JWT returned after login / register',
  })
  accessToken: string;
}
