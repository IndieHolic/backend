import * as path from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { FileType } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma.service';
import { HttpService } from '@nestjs/axios';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { basename } from 'path';

@Injectable()
export class UploadService {
  s3Client: S3Client;
  prismaService: PrismaService;
  httpService: HttpService;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
    this.prismaService = new PrismaService();
    this.httpService = new HttpService();
  }

  async uploadFile(file: Express.Multer.File) {
    console.log(process.env);
    try {
      const folder = file.mimetype;
      const key = `${folder}/${Date.now()}_${basename(
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

  async getPrivateFileUrl(id: number) {
    const file = await this.prismaService.files.findUnique({
      where: {
        id,
      },
    });

    if (!file) {
      throw new NotFoundException('파일을 찾을 수 없습니다.');
    }

    return await this.generateSignedUrl(file.key);
  }

  async uploadPrivateFile(
    file: Express.Multer.File,
    type: FileType,
    ownerId?: number,
  ) {
    const folder = type;
    const key = `${folder}/${Date.now()}_${path.basename(
      file.originalname,
    )}`.replace(/ /g, '');

    await this.s3Client.send(
      new PutObjectCommand({
        Key: key,
        Body: file.buffer,
        Bucket: process.env.AWS_BUCKET_PRIVATE,
        ContentType: file.mimetype,
      }),
    );

    const fileData = await this.prismaService.files.create({
      data: {
        key,
        size: file.size,
        type,
        ownerId,
      },
      select: {
        id: true,
      },
    });

    return fileData;
  }

  private async generateSignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_PRIVATE,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 300 });
  }
}
