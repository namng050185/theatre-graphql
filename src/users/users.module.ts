import { Module } from '@nestjs/common';
import { UsersResolvers } from './users.resolvers';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from './users.service';

@Module({
  providers: [UsersResolvers, UsersService],
  imports: [PrismaModule],
})
export class UsersModule {}
