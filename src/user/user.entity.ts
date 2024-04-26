import { User } from '@prisma/client';

export class UserEntity implements User {
  nickname: string;
  password: string;
  name: string;
  surname: string;
  photoLink: string;
}
