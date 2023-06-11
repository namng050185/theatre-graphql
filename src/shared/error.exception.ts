import { HttpException, HttpStatus } from '@nestjs/common';
import { MESSAGE_ERROR } from './constant';

export class ErrException extends HttpException {
  constructor(e: any) {
    super(MESSAGE_ERROR[e?.code] || e?.code, HttpStatus.BAD_REQUEST, {
      cause: new Error(e?.message || e?.code),
    });
  }
}

export class NotFoundException extends ErrException {
  constructor() {
    super({
      code: 'DATA_NOT_FOUND',
      message: 'Data not found',
    });
  }
}
