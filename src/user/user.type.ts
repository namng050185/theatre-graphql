/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength, MaxLength } from 'class-validator';

@InputType()
export class UserCreateInput {

 @Field()
 @IsNotEmpty({ message: 'EMAIL_IS_NOT_EMPTY' })
 @MaxLength(200, { message: 'EMAIL_IS_TOO_LONG' })
 @IsEmail({}, {
     message: 'EMAIL_IS_INCORRECT'
 })
 email: string

 @Field()
 @IsStrongPassword({}, { message: 'PASSWORD_IS_NOT_STRONG_ENOUGH'})
 @IsNotEmpty({ message: 'PASSWORD_IS_NOT_EMPTY'})
 @MaxLength(200, { message: 'PASSWORD_IS_TOO_LONG' })
 password?: string

 @Field()
 @MaxLength(200, { message: 'FULLNAME_IS_TOO_LONG' })
 fullname?: string

 @Field()
 meta?: any

}

@InputType()
export class UserUpdateInput {

 @Field()
 @IsNotEmpty({ message: 'EMAIL_IS_NOT_EMPTY' })
 @MaxLength(200, { message: 'EMAIL_IS_TOO_LONG' })
 @IsEmail({}, {
     message: 'EMAIL_IS_INCORRECT'
 })
 email?: string

 @Field()
 @IsStrongPassword({}, { message: 'PASSWORD_IS_NOT_STRONG_ENOUGH'})
 @MaxLength(200, { message: 'PASSWORD_IS_TOO_LONG' })
 password?: string

 @Field()
 @MaxLength(200, { message: 'FULLNAME_IS_TOO_LONG' })
 fullname?: string

 @Field()
 meta?: any

}
