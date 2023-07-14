/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsStrongPassword, IsOptional, MaxLength } from 'class-validator';

@InputType()
export class PostCreateInput {

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
 @IsNotEmpty({ message: 'AUTHORID_IS_NOT_EMPTY' })
 authorId: number

}

@InputType()
export class PostUpdateInput {

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
 @IsNotEmpty({ message: 'AUTHORID_IS_NOT_EMPTY' })
 authorId?: number

}
