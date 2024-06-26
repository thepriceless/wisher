import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { PrismaService } from 'src/prismas/prisma.service';
import { FriendRequestEntity } from './friend-request-types/friend.request.entity';
import { FriendRequestState } from './friend-request-types/friend.request.state.enum';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserFromToken(authorization: string): Promise<UserEntity> {
    const token = authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decodedToken === 'object' && 'nickname' in decodedToken) {
      const nickname = JSON.stringify(decodedToken.nickname).slice(1, -1);
      const user = await this.findOneByNickname(nickname);
      return user;
    }
  }

  async findOneByNickname(nickname: string): Promise<UserEntity> {
    return this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
    });
  }

  async findUserWithWishlists(nickname: string): Promise<UserEntity> {
    return await this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
      include: {
        ownedWishlists: true,
      },
    });
  }

  async findAllByNicknameStart(nicknameStart: string): Promise<UserEntity[]> {
    return this.prisma.user.findMany({
      where: {
        nickname: {
          startsWith: nicknameStart,
          mode: 'insensitive',
        },
      },
    });
  }

  async findAllByNameStart(nameStart: string): Promise<UserEntity[]> {
    return this.prisma.user.findMany({
      where: {
        name: {
          startsWith: nameStart,
          mode: 'insensitive',
        },
      },
    });
  }

  async findAllBySurnameStart(surnameStart: string): Promise<UserEntity[]> {
    return this.prisma.user.findMany({
      where: {
        surname: {
          startsWith: surnameStart,
          mode: 'insensitive',
        },
      },
    });
  }

  async createUser(user: UserEntity): Promise<UserEntity> {
    return this.prisma.user.create({
      data: {
        nickname: user.nickname,
        password: user.password,
        name: user.name,
        surname: user.surname,
        photoLink: user.photoLink,
        photoLinkAsKey: user.photoLinkAsKey,
      },
    });
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

    return await this.prisma.user.findMany({
      where: {
        nickname: {
          in: intersection,
        },
      },
    });
  }

  async findIncomingFriendRequestsByNickname(
    nickname: string,
  ): Promise<UserEntity[]> {
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

    return await this.prisma.user.findMany({
      where: {
        nickname: {
          in: receiverNicknames,
          notIn: senderNicknames,
        },
      },
    });
  }

  async getUserFriendship(
    senderNickname: string,
    receiverNickname: string,
  ): Promise<FriendRequestState> {
    const fromSenderToReceiver = await this.prisma.friendRequest.findUnique({
      where: {
        senderNickname_receiverNickname: {
          senderNickname: senderNickname,
          receiverNickname: receiverNickname,
        },
      },
    });

    const fromReceiverToSender = await this.prisma.friendRequest.findUnique({
      where: {
        senderNickname_receiverNickname: {
          senderNickname: receiverNickname,
          receiverNickname: senderNickname,
        },
      },
    });

    let friendshipState: FriendRequestState;
    if (fromSenderToReceiver !== null && fromReceiverToSender !== null) {
      friendshipState = FriendRequestState.FRIENDS;
    } else if (fromSenderToReceiver !== null) {
      friendshipState = FriendRequestState.SENT_BY_SENDER;
    } else if (fromReceiverToSender !== null) {
      friendshipState = FriendRequestState.SENT_BY_RECEIVER;
    } else {
      friendshipState = FriendRequestState.NOTHING;
    }

    return friendshipState;
  }

  async processFriendshipState(
    senderNickname: string,
    receiverNickname: string,
  ): Promise<FriendRequestState> {
    const friendshipState = await this.getUserFriendship(
      senderNickname,
      receiverNickname,
    );

    switch (friendshipState) {
      case FriendRequestState.NOTHING:
        await this.createFriendRequest(senderNickname, receiverNickname);
        return FriendRequestState.SENT_BY_SENDER;
      case FriendRequestState.SENT_BY_RECEIVER:
        await this.createFriendRequest(senderNickname, receiverNickname);
        return FriendRequestState.FRIENDS;
      case FriendRequestState.SENT_BY_SENDER:
        await this.deleteFriendRequest(senderNickname, receiverNickname);
        return FriendRequestState.NOTHING;
      case FriendRequestState.FRIENDS:
        await this.deleteFriendRequest(senderNickname, receiverNickname);
        return FriendRequestState.SENT_BY_RECEIVER;
    }
  }

  private async createFriendRequest(
    senderNickname: string,
    receiverNickname: string,
  ): Promise<FriendRequestEntity> {
    return await this.prisma.friendRequest.create({
      data: {
        senderNickname: senderNickname,
        receiverNickname: receiverNickname,
      },
    });
  }

  private async deleteFriendRequest(
    senderNickname: string,
    receiverNickname: string,
  ): Promise<FriendRequestEntity> {
    return await this.prisma.friendRequest.delete({
      where: {
        senderNickname_receiverNickname: {
          senderNickname: senderNickname,
          receiverNickname: receiverNickname,
        },
      },
    });
  }
}
