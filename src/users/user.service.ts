import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrException } from 'src/shared/error.exception';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user
      .findUnique({
        where: userWhereUniqueInput,
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user
      .findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user
      .create({
        data,
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user
      .update({
        data,
        where,
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user
      .delete({
        where,
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
  }
}
