import { Module } from '@nestjs/common';
import { UserResolvers } from './user.resolvers';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';

@Module({
  providers: [UserResolvers, UserService],
  imports: [PrismaModule],
})
export class UserModule {}
