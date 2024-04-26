import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findOneByNickname(nickname: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
    });
  }

  create(user: UserEntity): Promise<UserEntity> {
    return this.prisma.user.create({ data: user });
  }
}
