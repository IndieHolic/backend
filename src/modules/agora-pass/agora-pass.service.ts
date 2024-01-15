import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma.service';
import { CreateAgoraPassDto } from './dto/create-pass.dto';

@Injectable()
export class AgoraPassService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAgoraPass(userId: number) {
    const now = new Date();
    const passes = await this.prismaService.agoraPasses.findMany({
      where: {
        userId,
        startAt: { lt: now },
        endAt: { gt: now },
      },
      select: {
        id: true,
        startAt: true,
        endAt: true,
        totalTime: true,
      },
    });

    return { passes };
  }

  async purchaseAgoraPass(userId: number, pass: CreateAgoraPassDto) {
    const startAt = new Date();
    const endAt = startAt;
    endAt.setDate(endAt.getDate() + pass.duration);
    try {
      return await this.prismaService.agoraPasses.create({
        data: {
          userId,
          startAt,
          endAt,
          totalTime: pass.totalTime,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
