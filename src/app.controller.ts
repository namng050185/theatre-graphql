import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { MinioClientService } from './shared/minio-client.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private minioService: MinioClientService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      const filename = file?.originalname;
      return new Promise((resolve) => {
        fs.writeFile("/tmp/" + filename, file?.buffer, 'binary', async (err) => {
          if (err) {
            resolve({ filename, status: false, message: err?.message})
          }
          try {
            const res: any = await this.minioService.upload(file);
            if (typeof (res) === 'object') {
              resolve({ ...res, status: true })
            } else if (typeof (res) === 'string') {
              resolve({ filename, status: false, message: res })
            }
          } catch (e) {
            resolve({ filename, status: false, message: err?.message })
          }
        });
      })
    } else {
      return { status: false, message:'FILE_NOT_FOUND' }
    }
  }
}
