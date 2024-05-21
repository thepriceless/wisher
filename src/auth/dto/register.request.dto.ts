import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsAscii, MaxLength } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    description: 'Nickname of the user',
  })
  @IsAlphanumeric()
  @MaxLength(25, {
    message: 'Nickname is too long. Maximum length is 25 characters.',
  })
  nickname: string;

  @IsAscii()
  @MaxLength(25, {
    message: 'Password is too long. Maximum length is 25 characters.',
  })
  @ApiProperty({ description: 'Password of the user' })
  password: string;

  @IsAscii()
  @MaxLength(25, {
    message: 'Name is too long. Maximum length is 25 characters.',
  })
  @ApiProperty({ description: 'Name of the user' })
  name: string;

  @IsAscii()
  @MaxLength(25, {
    message: 'Surname is too long. Maximum length is 25 characters.',
  })
  @ApiProperty({ description: 'Surname of the user' })
  surname: string;
}
