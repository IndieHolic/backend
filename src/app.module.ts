import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/database/prisma.module';
import { UploadModule } from './modules/upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { StudioModule } from './modules/studio/studio.module';
import { MainBannerModule } from './modules/main-banner/main-banner.module';
import { GameSaleModule } from './modules/game-sale/game-sale.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    MulterModule.register({
      dest: './uploads',
    }),
    UploadModule,
    StudioModule,
    MainBannerModule,
    GameSaleModule,
  ],
  providers: [],
})
export class AppModule {}
