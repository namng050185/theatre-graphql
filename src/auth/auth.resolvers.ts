/* eslint-disable prettier/prettier */
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RefreshGuard } from './refresh.guards';
import { Body, UseGuards } from '@nestjs/common';
import { SignInInput } from './input.type';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Resolver('Auth')
export class AuthResolvers {
  constructor(private readonly authService: AuthService) {}

  @Mutation('signIn')
  async signIn(@Body(new ValidationPipe()) data: SignInInput): Promise<any> {
    return this.authService.signIn(data);
  }

  @UseGuards(RefreshGuard)
  @Mutation('refresh')
  async refresh(@Context('req') req): Promise<any> {
    return this.authService.refresh(req?.user);
  }
}
