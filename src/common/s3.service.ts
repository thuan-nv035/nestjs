import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { extname } from 'path';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
  }

  async uploadFileToS3(file: Express.Multer.File): Promise<string> {
    console.log('1');
    const uniqueName = new Date().getTime().toString();
    const filename = uniqueName + extname(file.originalname);
    console.log('2');
    const params: S3.Types.PutObjectRequest = {
      Bucket: 'myuploadfile',
      Key: filename,
      Body: file.buffer,
      ACL: 'public-read',
    };
    console.log('3');
    await this.s3.upload(params).promise();
    console.log('4');
    // Trả về URL công khai của file tải lên
    return `https://myuploadfile.s3.amazonaws.com/${filename}`;
  }
}
