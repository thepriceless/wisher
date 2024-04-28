import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UtiliesForControllers {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getUserFromToken(authorization: string): Promise<UserEntity> {
    const token = authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decodedToken === 'object' && 'nickname' in decodedToken) {
      const nickname = JSON.stringify(decodedToken.nickname).slice(1, -1);
      return await this.userService.findOneByNickname(nickname);
    }
  }
}
