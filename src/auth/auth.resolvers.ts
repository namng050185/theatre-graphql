/* eslint-disable prettier/prettier */
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RefreshGuard } from './refresh.guards';
import { UseGuards } from '@nestjs/common';

@Resolver('Auth')
export class AuthResolvers {
  constructor(private readonly authService: AuthService) {}

  @Mutation('signIn')
  async signIn(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<any> {
    return this.authService.signIn(email, password);
  }

  @UseGuards(RefreshGuard)
  @Mutation('refresh')
  async refresh(@Context('req') req): Promise<any> {
    return this.authService.refresh(req?.user);
  }
}
