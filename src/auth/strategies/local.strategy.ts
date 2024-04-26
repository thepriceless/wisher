import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'nickname',
    });
  }

  async validate(nickname: string, password: string): Promise<UserEntity> {
    // console.log('local strategy ', nickname);
    const user = await this.authService.validateUser(nickname, password);
    // console.log('local strategy user ', user);
    if (!user) {
      // console.log('local strategy user not found');
      window.location.href = '/auth/login';
      throw new UnauthorizedException();
    }
    return user;
  }
}
