import { Module } from '@nestjs/common';
import { StudioController } from './studio.controller';
import { StudioService } from './studio.service';
import { EmailService } from 'src/modules/email/email.service';

@Module({
  controllers: [StudioController],
  providers: [StudioService, EmailService],
})
export class StudioModule {}
