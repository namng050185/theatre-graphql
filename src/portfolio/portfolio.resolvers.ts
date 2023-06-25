/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Portfolio, Prisma } from '@prisma/client';
import { PortfolioService } from './portfolio.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guards';
import { PortfolioCreateInput, PortfolioUpdateInput } from './portfolio.type';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Resolver('Portfolio')
export class PortfolioResolvers {
  constructor(private portfolioService: PortfolioService ) { }

  @UseGuards(AuthGuard)
  @Query('portfolios')
  async portfolios(
    @Args('page') page?: number,
    @Args('limit') limit?: number,
    @Args('cursor') cursor?: Prisma.PortfolioWhereUniqueInput,
    @Args('where') where?: Prisma.PortfolioWhereInput,
    @Args('orderBy') orderBy?: Prisma.PortfolioOrderByWithRelationInput,
  ): Promise<any> {
    const skip = (page - 1) * limit;
    return this.portfolioService.portfolios({
      skip,
      limit,
      cursor,
      where,
      orderBy,
    });
  }

  @UseGuards(AuthGuard)
  @Query('portfolioById')
  async portfolioById(@Args('id') id: string): Promise<Portfolio> {
    return this.portfolioService.portfolio({ id: Number(id) });
  }

  @UseGuards(AuthGuard)
  @Mutation('createPortfolio')
  async create(@Args('data', new ValidationPipe()) data: PortfolioCreateInput): Promise<Portfolio> {
    return this.portfolioService.createPortfolio(data);
  }

  @UseGuards(AuthGuard)
  @Mutation('updatePortfolio')
  async update(
    @Args('id') id: string,
    @Args('data', new ValidationPipe()) data: PortfolioUpdateInput,
  ): Promise<Portfolio> {
    return this.portfolioService.updatePortfolio({ where: { id: Number(id) }, data });
  }

  @UseGuards(AuthGuard)
  @Mutation('deletePortfolio')
  async delete(@Args('id') id: string): Promise<Portfolio> {
    return this.portfolioService.deletePortfolio({ id: Number(id) });
  }
}
