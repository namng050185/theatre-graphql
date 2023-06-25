/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrException, NotFoundException } from 'src/shared/error.exception';
import { UserCreateInput } from './input.type';
import { validate } from 'class-validator';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = this.prisma.user
      .findUnique({
        where: userWhereUniqueInput,
        include: { posts: true, portfolios: true,}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const idcheck = (await user)?.id;
    if (idcheck) return user;
    else throw new NotFoundException();
  }

  async users(params: {
    skip?: number;
    limit?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<any> {
    const { skip, limit, cursor, where, orderBy } = params;
    const total = await this.prisma.user
      .count({ cursor, where })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const users = this.prisma.user
      .findMany({
        skip,
        take: limit,
        cursor,
        where,
        orderBy,
         include: { posts: true, portfolios: true,}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    return { entities: users, total };
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user
      .create({
        data,
        include: { posts: true, portfolios: true,}
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
        include: { posts: true, portfolios: true,}
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
        include: { posts: true, portfolios: true,}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
  }
}
