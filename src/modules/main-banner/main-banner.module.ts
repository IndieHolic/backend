import { Module } from '@nestjs/common';
import { MainBannerController } from './main-banner.controller';
import { MainBannerService } from './main-banner.service';

@Module({
  controllers: [MainBannerController],
  providers: [MainBannerService],
})
export class MainBannerModule {}
