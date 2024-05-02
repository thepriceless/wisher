import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(nickname: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findOneByNickname(nickname);
    if (!user) {
      console.log('user not found');
      return null;
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      console.log('user not found');
      return null;
    }
    return user;
  }

  async login(user: UserEntity): Promise<string> {
    const payload = { nickname: user.nickname };
    return this.jwtService.sign(payload);
  }

  async register(userDto: UserEntity): Promise<string> {
    const existingUser = await this.userService.findOneByNickname(
      userDto.nickname,
    );
    if (existingUser) {
      throw new BadRequestException('Nickname already reserved');
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser: UserEntity = {
      ...userDto,
      password: hashedPassword,
    };
    await this.userService.createUser(newUser);
    return this.login(newUser);
  }
}
