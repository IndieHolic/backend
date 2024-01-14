import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { AgoraPassService } from './agora-pass.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Users } from '@prisma/client';
import { CreateAgoraPassDto } from './dto/create-pass.dto';

@Controller('agora-pass')
export class AgoraPassController {
  private readonly logger = new Logger(AgoraPassController.name);
  constructor(private readonly agoraPassService: AgoraPassService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAgoraPass(@CurrentUser() user: Users) {
    try {
      return await this.agoraPassService.getAgoraPass(user.id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post()
  @UseGuards(JwtGuard)
  async purchaseAgoraPass(
    @CurrentUser() user: Users,
    @Body() pass: CreateAgoraPassDto,
  ) {
    try {
      return await this.agoraPassService.purchaseAgoraPass(user.id, pass);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
