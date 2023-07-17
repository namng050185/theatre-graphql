import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { MinioClientService } from './minio-client.service';

@Module({
  imports: [
    MinioModule.register({
      endPoint: '127.0.0.1',
      port: 9100,
      useSSL: false,
      accessKey: 'mkrNRDXulL6xGNsNpOyQ',
      secretKey: '9f17Nh3rX79A7kFtwbOcIUrGlBqSzCxN5d7hWUpL',
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
