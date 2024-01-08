import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as mimeTypes from 'mime-types';

@Injectable()
export class UploadsService {
  s3Client: S3Client;
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const folder = file.mimetype;
      const key = `${folder}/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '');

      await this.s3Client.send(
        new PutObjectCommand({
          Key: key,
          Body: file.buffer,
          Bucket: process.env.AWS_BUCKET,
          ContentType: file.mimetype,
        }),
      );
      const imgUrl = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${key}`;
      return { key, url: imgUrl };
    } catch (error) {
      throw new Error(error);
    }
  }
}
