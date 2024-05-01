import {
  BadRequestException,
  Body,
  Injectable,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/user.entity';
import { RegisterRequestDto } from 'src/auth/dto/register.request.dto';
import { UserService } from 'src/user/user.service';
import { AccessToken } from './types/access.token';
import { FileInterceptor } from '@nestjs/platform-express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(nickname: string, password: string): Promise<UserEntity> {
    // console.log('service ', nickname);
    const user = await this.userService.findOneByNickname(nickname);
    // console.log('service user ', user);
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

  async login(user: UserEntity): Promise<AccessToken> {
    const payload = { nickname: user.nickname };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(userDto: RegisterRequestDto): Promise<AccessToken> {
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
