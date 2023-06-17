import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthResolvers } from './auth.resolvers';

@Module({
  providers: [AuthResolvers, AuthService],
  imports: [PrismaModule],
  exports: [AuthService],
})
export class AuthModule {}
