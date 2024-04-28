import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { PrismaService } from 'src/prismas/prisma.service';

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

  async findFriendsByNickname(nickname: string): Promise<UserEntity[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    const senderNicknames = user.sender.map(
      (sender) => sender.receiverNickname,
    );
    const receiverNicknames = user.receiver.map(
      (receiver) => receiver.senderNickname,
    );

    const senderSet = new Set(senderNicknames);
    const receiverSet = new Set(receiverNicknames);

    const intersection = [...senderSet].filter((sender) =>
      receiverSet.has(sender),
    );

    return this.prisma.user.findMany({
      where: {
        nickname: {
          in: intersection,
        },
      },
    });
  }
}
