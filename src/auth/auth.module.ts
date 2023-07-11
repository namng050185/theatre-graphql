import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthResolvers } from './auth.resolvers';
import { PubSubModule } from 'src/shared/pubSub.module';

@Module({
  providers: [AuthResolvers, AuthService],
  imports: [PrismaModule, PubSubModule ],
  exports: [AuthService],
})
export class AuthModule { }
