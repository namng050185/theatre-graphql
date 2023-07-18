/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class MinioClientService {
    private readonly baseBucket = process.env.MINIO_BUCKET

    public get client() {
        return this.minio.client;
    }

    constructor(
        private readonly minio: MinioService,
    ) {
    }

    public async upload(file: any, baseBucket: string = this.baseBucket) {
        let error = '';
        const types: any[] = process.env.UPLOAD_ALLOW_TYPE.split(';')
        console.log(file.mimetype);
        if (!types.includes(file.mimetype)) {
            error = 'ERROR_FILE_FORMAT'
        }
        if (file.size > parseInt(process.env.UPLOAD_ALLOW_SIZE)) {
            error = 'ERROR_FILE_SIZE'
        }
        const temp_filename = Date.now().toString()
        const fileName = `${temp_filename}-${file.originalname}`;
        await this.client.putObject(baseBucket, fileName, file.buffer, parseInt(file.size)).catch((e) => {
            if (e) error = 'ERROR_UPLOADING_FILE'
        });
        if (error) return error;
        return { fileName, path: `/${baseBucket}/${fileName}` }
    }

    async delete(objetName: string, baseBucket: string = this.baseBucket) {
        this.client.removeObject(baseBucket, objetName, null, function (err) {
            if (err) throw new HttpException("Oops Something wrong happend", HttpStatus.BAD_REQUEST)
        })
    }
}