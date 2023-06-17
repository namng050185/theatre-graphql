import { Module } from '@nestjs/common';
import { PostResolvers } from './post.resolvers';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostService } from './post.service';

@Module({
  providers: [PostResolvers, PostService],
  imports: [PrismaModule],
})
export class PostModule {}
