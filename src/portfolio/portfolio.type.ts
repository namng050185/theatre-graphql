/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsStrongPassword, IsOptional, MaxLength } from 'class-validator';

@InputType()
export class PortfolioCreateInput {

 @Field()
 @MaxLength(200, { message: 'TITLE_IS_TOO_LONG' })
 @IsNotEmpty({ message: 'TITLE_IS_NOT_EMPTY' })
 title: string

 @Field()
 @IsOptional()
 @MaxLength(200, { message: 'CONTENT_IS_TOO_LONG' })
 content?: string

 @Field()
 @IsOptional()
 published?: boolean

 @Field()
 @IsOptional()
 authorId?: number

}

@InputType()
export class PortfolioUpdateInput {

 @Field()
 @IsOptional()
 @MaxLength(200, { message: 'TITLE_IS_TOO_LONG' })
 @IsNotEmpty({ message: 'TITLE_IS_NOT_EMPTY' })
 title?: string

 @Field()
 @IsOptional()
 @MaxLength(200, { message: 'CONTENT_IS_TOO_LONG' })
 content?: string

 @Field()
 @IsOptional()
 published?: boolean

 @Field()
 @IsOptional()
 authorId?: number

}
