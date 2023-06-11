import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';

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
}
