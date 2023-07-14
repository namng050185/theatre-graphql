/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsStrongPassword, IsOptional, MaxLength } from 'class-validator';

@InputType()
export class UserCreateInput {

 @Field()
 @MaxLength(200, { message: 'EMAIL_IS_TOO_LONG' })
 @IsEmail({}, { message: 'EMAIL_IS_INCORRECT'})
 @IsNotEmpty({ message: 'EMAIL_IS_NOT_EMPTY' })
 email: string

 @Field()
 @MaxLength(200, { message: 'PASSWORD_IS_TOO_LONG' })
 @IsStrongPassword({}, { message: 'PASSWORD_IS_NOT_STRONG_ENOUGH'})
 @IsNotEmpty({ message: 'PASSWORD_IS_NOT_EMPTY' })
 password: string

 @Field()
 @IsOptional()
 @MaxLength(200, { message: 'FULLNAME_IS_TOO_LONG' })
 fullname?: string

 @Field()
 @IsOptional()
 meta?: any

}

@InputType()
export class UserUpdateInput {

 @Field()
 @IsOptional()
 @MaxLength(200, { message: 'EMAIL_IS_TOO_LONG' })
 @IsEmail({}, { message: 'EMAIL_IS_INCORRECT'})
 @IsNotEmpty({ message: 'EMAIL_IS_NOT_EMPTY' })
 email?: string

 @Field()
 @IsOptional()
 @MaxLength(200, { message: 'PASSWORD_IS_TOO_LONG' })
 @IsStrongPassword({}, { message: 'PASSWORD_IS_NOT_STRONG_ENOUGH'})
 @IsNotEmpty({ message: 'PASSWORD_IS_NOT_EMPTY' })
 password?: string

 @Field()
 @IsOptional()
 @MaxLength(200, { message: 'FULLNAME_IS_TOO_LONG' })
 fullname?: string

 @Field()
 @IsOptional()
 meta?: any

}
