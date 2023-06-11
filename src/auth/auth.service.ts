import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.usersService.user({ email: username });
    if (!user) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    const { id, email, name } = user;
    // if (user?.password !== pass) {
    //     throw new UnauthorizedException();
    // }
    // const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    const payload = { sub: user.id, username: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token: access_token,
      info: {
        id,
        email,
        name,
      },
    };
  }
}
