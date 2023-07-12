/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrException, NotFoundException } from 'src/shared/error.exception';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService, @Inject('PUB_SUB')
  private pubSub: PubSub) { }

  async post(postWhereUniqueInput: Prisma.PostWhereUniqueInput): Promise<Post> {
    const post = this.prisma.post
      .findUnique({
        where: postWhereUniqueInput,
        include: { author: true,}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const idcheck = (await post)?.id;
    if (idcheck) return post;
    else throw new NotFoundException();
  }

  async posts(params: {
    skip?: number;
    limit?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<any> {
    const { skip, limit, cursor, where, orderBy } = params;
    const total = await this.prisma.post
      .count({ cursor, where })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const posts = this.prisma.post
      .findMany({
        skip,
        take: limit,
        cursor,
        where,
        orderBy,
         include: { author: true,}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    return { entities: posts, total };
  }

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    const result = await this.prisma.post
      .create({
        data,
        include: { author: true,}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const onChange = { action: 'created', module: 'Post', info: result }
    this.pubSub.publish('onChange', { onChange });
    return result;
  }

  async updatePost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { where, data } = params;
    const result = await this.prisma.post
      .update({
        data,
        where,
        include: { author: true,}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const onChange = { action: 'updated', module: 'Post', info: result }
    this.pubSub.publish('onChange', { onChange });
    return result;
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    const result = await  this.prisma.post
      .delete({
        where,
        include: { author: true,}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const onChange = { action: 'deleted', module: 'Post', info: result }
    this.pubSub.publish('onChange', { onChange });
    return result;
  }
}
