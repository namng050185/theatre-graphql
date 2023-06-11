import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthResolvers } from './auth.resolvers';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [AuthResolvers, AuthService, UsersService],
  imports: [PrismaModule],
  exports: [AuthService],
})
export class AuthModule {}
