/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const GREEN = '\u001b[1;32m ';
const YELLOW = '\u001b[1;33m ';
const BLUE = '\u001b[1;34m ';
const PURPLE = '\u001b[1;35m ';
const CYAN = '\u001b[1;36m ';
const RESET = '\u001b[0m';
const TYPE = {
  Int: 'number',
  Float: 'number',
  String: 'string',
  Boolean: 'boolean',
  Json: 'any',
};
//Lấy về danh sách fields
const getFields = async (name) => {
  const dmmf = await prisma._getDmmf();
  return dmmf.modelMap[name].fields;
};
//hàm tạo nội dung file Type
const generateType = async (name) => {
  const fields = await getFields(name);
  const createAttrInput = (isAdd) => {
    let str = '';
    fields.map((field) => {
      if (!field.isId && field.kind === 'scalar') {
        str += '\n @Field()\n';
        if (field.name === 'password') {
          str += ` @IsStrongPassword({}, { message: 'PASSWORD_IS_NOT_STRONG_ENOUGH'})\n`;
          if (isAdd) {
            str += ` @IsNotEmpty({ message: 'PASSWORD_IS_NOT_EMPTY'})\n`;
          }
        } else if (field.isRequired) {
          str +=
            ` @IsNotEmpty({ message: '` +
            field.name.toUpperCase() +
            `_IS_NOT_EMPTY' })\n`;
        }
        if (field.type === 'String') {
          str +=
            ` @MaxLength(200, { message: '` +
            field.name.toUpperCase() +
            `_IS_TOO_LONG' })\n`;
        }
        str +=
          ' ' +
          field.name +
          (field.isRequired ? '' : '?') +
          ': ' +
          TYPE[field.type] +
          '\n';
      }
    });
    return str;
  };
  return `/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength, MaxLength } from 'class-validator';

@InputType()
export class ${name}CreateInput {
${createAttrInput(true)}
}

@InputType()
export class ${name}UpdateInput {
${createAttrInput(false)}
}
`;
};
//hàm tạo nội dung file Schema
const generateSchema = async (name) => {
  const fields = await getFields(name);
  const createAttrMain = () => {
    let str = '';
    fields.map((field) => {
      str +=
        ' ' +
        field.name +
        ': ' +
        (field.kind === 'object' && !field.relationFromFields?.length
          ? '[' + field.type + ']'
          : (field.isId ? 'ID' : field.type == 'Json' ? 'JSON' : field.type) +
            (field.isRequired ? '!' : '')) +
        '\n';
    });
    return str;
  };

  const createAttrInput = () => {
    let str = '';
    fields.map((field) => {
      if (!field.isId && field.kind === 'scalar') {
        str +=
          ' ' +
          field.name +
          ': ' +
          (field.type == 'Json' ? 'JSON' : field.type) +
          (field.isRequired ? '!' : '') +
          '\n';
      }
    });
    return str;
  };
  const createAttrType = (_type) => {
    let str = '';
    fields.map((field) => {
      if (field.kind === 'scalar' && field.type !== 'Json') {
        str += ' ' + field.name + ': ' + _type + '\n';
      }
    });
    return str;
  };
  return `
type ${name} {
${createAttrMain()}
}

input ${name}Input {
${createAttrInput()}
}

input ${name}SortInput {
${createAttrType('SortType')}
}

input ${name}WhereInput{
 AND: JSON
 OR: JSON
 NOT: JSON
${createAttrType('JSON')}
}

type ${name}List {
  entities: [${name}!]
  total: Int
}

type Query {
  ${capFirst(name)}ById(id: ID!): ${name}
  ${capFirst(
    name,
  )}s(page: Int! = 1, limit: Int! = 25, where:${name}WhereInput,  orderBy: [${name}SortInput] ): ${name}List
}

type Mutation {
  create${name}(data: ${name}Input!): ${name}
  update${name}(id: ID!, data: ${name}Input!): ${name}
  delete${name}(id: ID!): ${name}
}
`;
};
//hàm tạo nội dung file service
const generateService = async (name) => {
  const getInclude = async () => {
    const fields = await getFields(name);
    let str = '';
    fields.map((field) => {
      if (field.kind === 'object') {
        str += ' ' + field.name + ': true' + ',';
      }
    });
    return str;
  };
  const includes = await getInclude();
  const attr = (name + '').toLowerCase();
  return `/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ${name}, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrException, NotFoundException } from 'src/shared/error.exception';

@Injectable()
export class ${name}Service {
  constructor(private prisma: PrismaService) { }

  async ${attr}(${attr}WhereUniqueInput: Prisma.${name}WhereUniqueInput): Promise<${name}> {
    const ${attr} = this.prisma.${attr}
      .findUnique({
        where: ${attr}WhereUniqueInput,
        ${includes ? 'include: {' + includes + '}' : ''}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const idcheck = (await ${attr})?.id;
    if (idcheck) return ${attr};
    else throw new NotFoundException();
  }

  async ${attr}s(params: {
    skip?: number;
    limit?: number;
    cursor?: Prisma.${name}WhereUniqueInput;
    where?: Prisma.${name}WhereInput;
    orderBy?: Prisma.${name}OrderByWithRelationInput;
  }): Promise<any> {
    const { skip, limit, cursor, where, orderBy } = params;
    const total = await this.prisma.${attr}
      .count({ cursor, where })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    const ${attr}s = this.prisma.${attr}
      .findMany({
        skip,
        take: limit,
        cursor,
        where,
        orderBy,
         ${includes ? 'include: {' + includes + '}' : ''}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
    return { entities: ${attr}s, total };
  }

  async create${name}(data: Prisma.${name}CreateInput): Promise<${name}> {
    return this.prisma.${attr}
      .create({
        data,
        ${includes ? 'include: {' + includes + '}' : ''}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
  }

  async update${name}(params: {
    where: Prisma.${name}WhereUniqueInput;
    data: Prisma.${name}UpdateInput;
  }): Promise<${name}> {
    const { where, data } = params;
    return this.prisma.${attr}
      .update({
        data,
        where,
        ${includes ? 'include: {' + includes + '}' : ''}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
  }

  async delete${name}(where: Prisma.${name}WhereUniqueInput): Promise<${name}> {
    return this.prisma.${attr}
      .delete({
        where,
        ${includes ? 'include: {' + includes + '}' : ''}
      })
      .catch(async (e) => {
        await this.prisma.$disconnect();
        throw new ErrException(e);
      });
  }
}
`;
};
//hàm tạo nội dung file resolvers
const generateResolvers = async (name) => {
  const attr = (name + '').toLowerCase();
  return `/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ${name}, Prisma } from '@prisma/client';
import { ${name}Service } from './${attr}.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guards';
import { ${name}CreateInput, ${name}UpdateInput } from './${attr}.type';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Resolver('${name}')
export class ${name}Resolvers {
  constructor(private ${attr}Service: ${name}Service ) { }

  @UseGuards(AuthGuard)
  @Query('${attr}s')
  async ${attr}s(
    @Args('page') page?: number,
    @Args('limit') limit?: number,
    @Args('cursor') cursor?: Prisma.${name}WhereUniqueInput,
    @Args('where') where?: Prisma.${name}WhereInput,
    @Args('orderBy') orderBy?: Prisma.${name}OrderByWithRelationInput,
  ): Promise<any> {
    const skip = (page - 1) * limit;
    return this.${attr}Service.${attr}s({
      skip,
      limit,
      cursor,
      where,
      orderBy,
    });
  }

  @UseGuards(AuthGuard)
  @Query('${attr}ById')
  async ${attr}ById(@Args('id') id: string): Promise<${name}> {
    return this.${attr}Service.${attr}({ id: Number(id) });
  }

  @UseGuards(AuthGuard)
  @Mutation('create${name}')
  async create(@Args('data', new ValidationPipe()) data: ${name}CreateInput): Promise<${name}> {
    return this.${attr}Service.create${name}(data);
  }

  @UseGuards(AuthGuard)
  @Mutation('update${name}')
  async update(
    @Args('id') id: string,
    @Args('data', new ValidationPipe()) data: ${name}UpdateInput,
  ): Promise<${name}> {
    return this.${attr}Service.update${name}({ where: { id: Number(id) }, data });
  }

  @UseGuards(AuthGuard)
  @Mutation('delete${name}')
  async delete(@Args('id') id: string): Promise<${name}> {
    return this.${attr}Service.delete${name}({ id: Number(id) });
  }
}
`;
};
//hàm tạo nội dung file module
const generatemModule = async (name) => {
  const attr = (name + '').toLowerCase();
  return `import { Module } from '@nestjs/common';
import { ${name}Resolvers } from './${attr}.resolvers';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ${name}Service } from './${attr}.service';

@Module({
  providers: [${name}Resolvers, ${name}Service],
  imports: [PrismaModule],
})
export class ${name}Module {}
`;
};
//Hàm điều huớng tạo file cho API
const generateAPI = async (key, model) => {
  const name = model.name;
  //1.Tạo File [key].schema.gql
  console.log(YELLOW + 'Tạo Nội dung file : ' + key + '.schema.gql' + RESET);
  writeFile({
    folder: 'src/' + key,
    file: key + '.schema.gql',
    contents: await generateSchema(name),
  });
  //2.Tạo File [key].service.ts
  console.log(BLUE + 'Tạo Nội dung file : ' + key + '.service.ts' + RESET);
  writeFile({
    folder: 'src/' + key,
    file: key + '.service.ts',
    contents: await generateService(name),
  });
  //3.Tạo File [key].resolvers.ts
  console.log(PURPLE + 'Tạo Nội dung file : ' + key + '.resolvers.ts' + RESET);
  writeFile({
    folder: 'src/' + key,
    file: key + '.resolvers.ts',
    contents: await generateResolvers(name),
  });
  //4.Tạo File [key].module.ts
  console.log(CYAN + 'Tạo Nội dung file : ' + key + '.module.ts' + RESET);
  writeFile({
    folder: 'src/' + key,
    file: key + '.module.ts',
    contents: await generatemModule(name),
  });
  //4.Tạo File [key].type.ts
  console.log(CYAN + 'Tạo Nội dung file : ' + key + '.type.ts' + RESET);
  writeFile({
    folder: 'src/' + key,
    file: key + '.type.ts',
    contents: await generateType(name),
  });
  console.log(RESET);
};
//Hàm chạy chính
const main = async () => {
  for (const key in prisma) {
    if (!key.startsWith('_') && typeof prisma[key] === 'object') {
      const name = prisma[key].name;
      console.log(GREEN + 'Tạo API cho module: ' + name);
      await generateAPI(key, prisma[key]);
    }
  }
};
// Ghi file
const writeFile = ({ folder, file, contents, skipIfExist = false }) => {
  const filePath = folder + '/' + file;
  try {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  } catch (err) {
    console.error(err);
  }
  const resOutputFilePath = path.resolve(filePath);
  if (skipIfExist == true && fs.existsSync(resOutputFilePath) == true) {
    console.warn(filePath);
    return;
  }
  return fs.writeFile(resOutputFilePath, contents, (err) => {
    if (err) {
      return console.error(err);
    }
    //console.log(GREEN + filePath + RESET);
  });
};

const capFirst = (str) => {
  return str[0].toLowerCase() + str.slice(1);
};

main();
