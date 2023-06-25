/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength, MaxLength } from 'class-validator';

@InputType()
export class PortfolioCreateInput {

 @Field()
 @IsNotEmpty({ message: 'TITLE_IS_NOT_EMPTY' })
 @MaxLength(200, { message: 'TITLE_IS_TOO_LONG' })
 title: string

 @Field()
 @MaxLength(200, { message: 'CONTENT_IS_TOO_LONG' })
 content?: string

 @Field()
 published?: boolean

 @Field()
 authorId?: number

}

@InputType()
export class PortfolioUpdateInput {

 @Field()
 @IsNotEmpty({ message: 'TITLE_IS_NOT_EMPTY' })
 @MaxLength(200, { message: 'TITLE_IS_TOO_LONG' })
 title: string

 @Field()
 @MaxLength(200, { message: 'CONTENT_IS_TOO_LONG' })
 content?: string

 @Field()
 published?: boolean

 @Field()
 authorId?: number

}
