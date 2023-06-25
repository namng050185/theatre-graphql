/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Post, Prisma } from '@prisma/client';
import { PostService } from './post.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guards';
import { PostCreateInput, PostUpdateInput } from './post.type';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Resolver('Post')
export class PostResolvers {
  constructor(private postService: PostService ) { }

  @UseGuards(AuthGuard)
  @Query('posts')
  async posts(
    @Args('page') page?: number,
    @Args('limit') limit?: number,
    @Args('cursor') cursor?: Prisma.PostWhereUniqueInput,
    @Args('where') where?: Prisma.PostWhereInput,
    @Args('orderBy') orderBy?: Prisma.PostOrderByWithRelationInput,
  ): Promise<any> {
    const skip = (page - 1) * limit;
    return this.postService.posts({
      skip,
      limit,
      cursor,
      where,
      orderBy,
    });
  }

  @UseGuards(AuthGuard)
  @Query('postById')
  async postById(@Args('id') id: string): Promise<Post> {
    return this.postService.post({ id: Number(id) });
  }

  @UseGuards(AuthGuard)
  @Mutation('createPost')
  async create(@Args('data', new ValidationPipe()) data: PostCreateInput): Promise<Post> {
    return this.postService.createPost(data);
  }

  @UseGuards(AuthGuard)
  @Mutation('updatePost')
  async update(
    @Args('id') id: string,
    @Args('data', new ValidationPipe()) data: PostUpdateInput,
  ): Promise<Post> {
    return this.postService.updatePost({ where: { id: Number(id) }, data });
  }

  @UseGuards(AuthGuard)
  @Mutation('deletePost')
  async delete(@Args('id') id: string): Promise<Post> {
    return this.postService.deletePost({ id: Number(id) });
  }
}
