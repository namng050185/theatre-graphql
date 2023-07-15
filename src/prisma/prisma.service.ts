import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    this.$use(async (params, next) => {
      if (
        (params.action == 'create' || params.action == 'update') &&
        params.model == 'User'
      ) {
        const user = params.args.data;
        if (user.password) {
          const salt = bcryptjs.genSaltSync(10);
          const hash = bcryptjs.hashSync(user.password, salt);
          user.password = hash;
        }
        params.args.data = user;
      }
      return next(params);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
