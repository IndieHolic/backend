import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/database/prisma.module';
import { UploadsModule } from './modules/upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/modules/auth/auth.module';
import { BoardModule } from './modules/board/board.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    PrismaModule,
    AuthModule,
    MulterModule.register({
      dest: './uploads',
    }),
    UploadsModule,
    BoardModule,
  ],
  providers: [],
})
export class AppModule {}
