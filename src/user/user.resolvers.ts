/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User, Prisma } from '@prisma/client';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guards';
import { UserCreateInput, UserUpdateInput } from './user.type';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Resolver('User')
export class UserResolvers {
  constructor(private userService: UserService ) { }

  @UseGuards(AuthGuard)
  @Query('users')
  async users(
    @Args('page') page?: number,
    @Args('limit') limit?: number,
    @Args('cursor') cursor?: Prisma.UserWhereUniqueInput,
    @Args('where') where?: Prisma.UserWhereInput,
    @Args('orderBy') orderBy?: Prisma.UserOrderByWithRelationInput,
  ): Promise<any> {
    const skip = (page - 1) * limit;
    return this.userService.users({
      skip,
      limit,
      cursor,
      where,
      orderBy,
    });
  }

  @UseGuards(AuthGuard)
  @Query('userById')
  async userById(@Args('id') id: string): Promise<User> {
    return this.userService.user({ id: Number(id) });
  }

  @UseGuards(AuthGuard)
  @Mutation('createUser')
  async create(@Args('data', new ValidationPipe()) data: UserCreateInput): Promise<User> {
    return this.userService.createUser(data);
  }

  @UseGuards(AuthGuard)
  @Mutation('updateUser')
  async update(
    @Args('id') id: string,
    @Args('data', new ValidationPipe()) data: UserUpdateInput,
  ): Promise<User> {
    return this.userService.updateUser({ where: { id: Number(id) }, data });
  }

  @UseGuards(AuthGuard)
  @Mutation('deleteUser')
  async delete(@Args('id') id: string): Promise<User> {
    return this.userService.deleteUser({ id: Number(id) });
  }
}
