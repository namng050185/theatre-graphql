/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength } from 'class-validator';

@InputType()
export class UserCreateInput {
    @Field()
    @IsEmail({}, {
        message: 'EMAIL_IS_INCORRECT'
    })
    @IsNotEmpty({
        message: 'EMAIL_IS_NOT_EMPTY'
    })
    email: string;

    @Field()
    @IsStrongPassword({}, {
        message: 'PASSWORD_IS_NOT_STRONG_ENOUGH',
    })
    @MinLength(6, {
        message: 'PASSWORD_IS_TOO_SHORT',
    })
    @IsNotEmpty()
    password: string;

    @Field()
    fullname: string;
}