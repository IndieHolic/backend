import { Module } from '@nestjs/common';
import { AgoraPassController } from './agora-pass.controller';
import { AgoraPassService } from './agora-pass.service';

@Module({
  controllers: [AgoraPassController],
  providers: [AgoraPassService],
})
export class AgoraPassModule {}
