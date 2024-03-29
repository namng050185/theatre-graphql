/* eslint-disable prettier/prettier */
import { Resolver, Mutation, Context, Subscription, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RefreshGuard } from './refresh.guards';
import { Body, Inject, Injectable, UseGuards } from '@nestjs/common';
import { SignInInput } from './input.type';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { PubSub } from 'graphql-subscriptions';
import { MinioService } from 'nestjs-minio-client';
//const pubSub = new PubSub();
@Resolver('Auth')
export class AuthResolvers {
  constructor(private readonly authService: AuthService,
    @Inject('PUB_SUB')
    private pubSub: PubSub,) { }

  @Mutation('signIn')
  async signIn(@Body(new ValidationPipe()) data: SignInInput): Promise<any> {
    return this.authService.signIn(data);
  }

  @UseGuards(RefreshGuard)
  @Mutation('refresh')
  async refresh(@Context('req') req): Promise<any> {
    return this.authService.refresh(req?.user);
  }

  @Mutation('setup')
  async setup() {
    return this.authService.setup();;
  }

  @Subscription('onChange')
  onChange() {
    return this.pubSub.asyncIterator('onChange');
  }

  @Query('demo')
  async demo(): Promise<any> {
    return this.authService.demo();
  }
}
