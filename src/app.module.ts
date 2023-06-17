import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANTS } from './shared/constant';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    UserModule,
    PostModule,
    AuthModule,
    PortfolioModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.gql'],
      sortSchema: true,
      installSubscriptionHandlers: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1800s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaModule],
})
export class AppModule {}
