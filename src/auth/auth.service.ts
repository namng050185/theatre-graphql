/* eslint-disable prettier/prettier */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrException } from 'src/shared/error.exception';
import * as bcryptjs from 'bcryptjs';
import { JWT_CONSTANTS } from 'src/shared/constant';
import { SignInInput } from './input.type';
import { PubSub } from 'graphql-subscriptions';
import { MinioClientService } from 'src/shared/minio-client.service';
@Injectable()
export class AuthService {
  constructor(public jwtService: JwtService,
    private minioService: MinioClientService,
    @Inject('PUB_SUB')
    private pubSub: PubSub,
    private prisma: PrismaService) { }

  async signIn(data: SignInInput): Promise<any> {
    const { email, password } = data;
    const user = await this.prisma.user
      .findUnique({
        where: { email },
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    if (!user) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    const checkPassword = bcryptjs.compareSync(password, user?.password)
    if (!checkPassword) throw new UnauthorizedException('PASSWORD_IS_INCORRECT');
    return this.createData(user);
  }

  async refresh(payload: any): Promise<any> {
    if (!payload || !payload.email) throw new UnauthorizedException('UNAUTHORIZED');
    const user = await this.prisma.user
      .findUnique({
        where: { email: payload.email },
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    if (!user) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    return this.createData(user);
  }

  async createData(user: any) {
    user.password ='PASSWORD';
    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload, { secret: JWT_CONSTANTS.secret, });
    const refresh_token = await this.jwtService.signAsync(payload, { secret: JWT_CONSTANTS.secretRefresh, expiresIn: '2592000s' });
    return {
      access_token,
      refresh_token,
      info: user,
    };
  }

  async setup(): Promise<any> {
    const data = {
      email: "admin@gmail.com",
      password: "Troidatoi1@"
    }
    const result = await this.prisma.user
      .create({data})
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const onChange = { action: 'created', module: 'User', info: result }
    this.pubSub.publish('onChange', { onChange });
    return result;
  }

  async demo() {
    const all = await this.minioService.client.listBuckets();
    console.log(all);
    return {}
  }
}
