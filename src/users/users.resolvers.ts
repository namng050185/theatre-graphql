import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';

@Resolver('User')
export class UsersResolvers {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  @Query('users')
  async users(
    @Args('page') page?: number,
    @Args('take') take?: number,
    @Args('cursor') cursor?: Prisma.UserWhereUniqueInput,
    @Args('where') where?: Prisma.UserWhereInput,
    @Args('orderBy') orderBy?: Prisma.UserOrderByWithRelationInput,
  ): Promise<User[]> {
    const skip = (page - 1) * take;
    return this.userService.users({ skip, take, cursor, where, orderBy });
  }

  @Query('userById')
  async userById(@Args('id') id: string): Promise<User | null> {
    return this.userService.user({ id: Number(id) });
  }

  @Query('userByEmail')
  async userByEmail(@Args('email') email: string): Promise<User | null> {
    return this.userService.user({ email });
  }

  @Mutation('createUser')
  async create(@Args('data') data: Prisma.UserCreateInput): Promise<User> {
    return this.userService.createUser(data);
  }

  @Mutation('updateUser')
  async update(
    @Args('id') id: string,
    @Args('data') data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.userService.updateUser({ where: { id: Number(id) }, data });
  }

  @Mutation('deleteUser')
  async delete(@Args('id') id: string): Promise<User> {
    return this.userService.deleteUser({ id: Number(id) });
  }
}
