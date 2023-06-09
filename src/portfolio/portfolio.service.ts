/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { Portfolio, Prisma } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrException, NotFoundException } from 'src/shared/error.exception';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService, @Inject('PUB_SUB')
  private pubSub: PubSub) { }

  async portfolio(portfolioWhereUniqueInput: Prisma.PortfolioWhereUniqueInput): Promise<Portfolio> {
    const portfolio = this.prisma.portfolio
      .findUnique({
        where: portfolioWhereUniqueInput,
        include: { author: true,}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const idcheck = (await portfolio)?.id;
    if (idcheck) return portfolio;
    else throw new NotFoundException();
  }

  async portfolios(params: {
    skip?: number;
    limit?: number;
    cursor?: Prisma.PortfolioWhereUniqueInput;
    where?: Prisma.PortfolioWhereInput;
    orderBy?: Prisma.PortfolioOrderByWithRelationInput;
  }): Promise<any> {
    const { skip, limit, cursor, where, orderBy } = params;
    const total = await this.prisma.portfolio
      .count({ cursor, where })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const portfolios = this.prisma.portfolio
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
    return { entities: portfolios, total };
  }

  async createPortfolio(data: Prisma.PortfolioCreateInput): Promise<Portfolio> {
    const result = await this.prisma.portfolio
      .create({
        data,
        include: { author: true,}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const onChange = { action: 'created', module: 'Portfolio', info: result }
    this.pubSub.publish('onChange', { onChange });
    return result;
  }

  async updatePortfolio(params: {
    where: Prisma.PortfolioWhereUniqueInput;
    data: Prisma.PortfolioUpdateInput;
  }): Promise<Portfolio> {
    const { where, data } = params;
    const result = await this.prisma.portfolio
      .update({
        data,
        where,
        include: { author: true,}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const onChange = { action: 'updated', module: 'Portfolio', info: result }
    this.pubSub.publish('onChange', { onChange });
    return result;
  }

  async deletePortfolio(where: Prisma.PortfolioWhereUniqueInput): Promise<Portfolio> {
    const result = await  this.prisma.portfolio
      .delete({
        where,
        include: { author: true,}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const onChange = { action: 'deleted', module: 'Portfolio', info: result }
    this.pubSub.publish('onChange', { onChange });
    return result;
  }
}
