## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Run migrate DB

```bash
$ npx prisma migrate dev --name init
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## QUERY Example

[Prisma](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference) : Guide Query where for get multiple data


```bash
{
  "page": 1,
  "limit": 25,
  "orderBy": [
    {
      "name": "asc",
    },
    {
      "id": "desc",
    }
  ],
  "where": {
    "OR": [
      {
        "name": {
          "contains": "3",
        }
      },
      {
        "name": {
          "contains": "2",
        }
      }
    ],
    "id": {
      "gte": 5
    },
    "AND": [
      {
        "email": {
          "contains": "gmail",
        }
      },
      {
        "email": {
          "contains": "1",
        }
      }
    ],
    
  },
}
```


## RUN DOCKER

```bash
# Prod
$ docker-compose -f docker-compose.prod.yml up --build

# Dev
$ docker-compose -f up --build