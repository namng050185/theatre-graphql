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

```bash
{
  "page": 1,
  "take": 25,
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