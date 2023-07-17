import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthResolvers } from './auth.resolvers';
import { PubSubModule } from 'src/shared/pubSub.module';
import { MinioClientModule } from 'src/shared/minio-client.module';

@Module({
  providers: [AuthResolvers, AuthService],
  imports: [PrismaModule, PubSubModule, MinioClientModule],
  exports: [AuthService],
})
export class AuthModule {}
