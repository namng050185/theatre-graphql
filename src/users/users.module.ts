import { Module } from '@nestjs/common';
import { UsersResolvers } from './users.resolvers';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';

@Module({
  providers: [UsersResolvers, UserService],
  imports: [PrismaModule],
})
export class UsersModule {}
