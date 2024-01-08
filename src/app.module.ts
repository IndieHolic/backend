import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UploadsModule } from './uploads/uploads.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    PrismaModule,
    MulterModule.register({
      dest: './uploads',
    }),
    UploadsModule,
  ],
  providers: [],
})
export class AppModule {}
