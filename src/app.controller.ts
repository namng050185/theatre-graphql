import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      const filename = file?.originalname;
      return new Promise((resolve, reject) => {
        fs.writeFile("/tmp/" + filename, file?.buffer, 'binary', (err) => {
          if (err) {
            reject({ filename, status: false, message: err?.message})
          }
          resolve({ filename, status: true })
        });
      })
    } else {
      return { status: false, message:'FILE_NOT_FOUND' }
    }
  }
}
