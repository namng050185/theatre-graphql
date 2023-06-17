import { Module } from '@nestjs/common';
import { PortfolioResolvers } from './portfolio.resolvers';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PortfolioService } from './portfolio.service';

@Module({
  providers: [PortfolioResolvers, PortfolioService],
  imports: [PrismaModule],
})
export class PortfolioModule {}
