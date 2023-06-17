/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrException } from 'src/shared/error.exception';

@Injectable()
export class AuthService {
  constructor(public jwtService: JwtService, private prisma: PrismaService) { }

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.prisma.user
      .findUnique({
        where: { email: username },
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    console.log(user);
    //const user = null; //await this.usersService.user({ email: username });
    if (!user) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    const { id, email, fullname } = user;
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
        fullname,
      },
    };
  }
}
