import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guards';

@Resolver('User')
export class UsersResolvers {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Query('users')
  async users(
    @Args('page') page?: number,
    @Args('take') take?: number,
    @Args('cursor') cursor?: Prisma.UserWhereUniqueInput,
    @Args('where') where?: Prisma.UserWhereInput,
    @Args('orderBy') orderBy?: Prisma.UserOrderByWithRelationInput,
  ): Promise<User[]> {
    const skip = (page - 1) * take;
    return this.usersService.users({ skip, take, cursor, where, orderBy });
  }

  @UseGuards(AuthGuard)
  @Query('userById')
  async userById(@Args('id') id: string): Promise<User> {
    return this.usersService.user({ id: Number(id) });
  }

  @UseGuards(AuthGuard)
  @Query('userByEmail')
  async userByEmail(@Args('email') email: string): Promise<User> {
    return this.usersService.user({ email });
  }

  @UseGuards(AuthGuard)
  @Mutation('createUser')
  async create(@Args('data') data: Prisma.UserCreateInput): Promise<User> {
    return this.usersService.createUser(data);
  }

  @UseGuards(AuthGuard)
  @Mutation('updateUser')
  async update(
    @Args('id') id: string,
    @Args('data') data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.usersService.updateUser({ where: { id: Number(id) }, data });
  }

  @UseGuards(AuthGuard)
  @Mutation('deleteUser')
  async delete(@Args('id') id: string): Promise<User> {
    return this.usersService.deleteUser({ id: Number(id) });
  }
}
