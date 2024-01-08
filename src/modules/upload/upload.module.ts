import { Module } from '@nestjs/common';
import { UploadsService } from './upload.service';
import { UploadsController } from './upload.controller';

@Module({
  providers: [UploadsService],
  controllers: [UploadsController],
})
export class UploadsModule {}
