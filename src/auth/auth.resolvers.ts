/* eslint-disable prettier/prettier */
import { Resolver, Mutation, Context, Subscription } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RefreshGuard } from './refresh.guards';
import { Body, Inject, UseGuards } from '@nestjs/common';
import { SignInInput } from './input.type';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { PubSub } from 'graphql-subscriptions';
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

  @Mutation('demo')
  async demo() {
    const data = { action: 'created', module: 'demo', info: { title:'Nam', age: 98} }
    this.pubSub.publish('onChange', { onChange: data });
    return data;
  }

  @Subscription('onChange')
  onChange() {
    return this.pubSub.asyncIterator('onChange');
  }
}
