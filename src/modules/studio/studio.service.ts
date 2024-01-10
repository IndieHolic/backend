import { BadRequestException, Injectable } from '@nestjs/common';
import { getPageOffset } from 'src/common/utils/pagination.util';
import { PrismaService } from 'src/config/database/prisma.service';
import { EmailService } from 'src/modules/email/email.service';
import { SELECT_STUDIO } from 'src/modules/studio/constants/select.constant';
import { CreateStudioRequestDto } from 'src/modules/studio/dtos/create-studio.dto';
import { InviteStudioRequestDto } from 'src/modules/studio/dtos/invite-studio.dto';
import { UpdateStudioRequestDto } from 'src/modules/studio/dtos/update-studio.dto';

@Injectable()
export class StudioService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async find(id: number) {
    const studio = await this.prismaService.studios.findUnique({
      where: { id },
      select: SELECT_STUDIO,
    });

    if (!studio) {
      throw new BadRequestException('존재하지 않는 스튜디오입니다.');
    }

    return studio;
  }

  async create(
    managerId: number,
    createStudioRequestDto: CreateStudioRequestDto,
  ) {
    const { name } = createStudioRequestDto;
    const studio = await this.prismaService.studios.create({
      data: {
        name,
        managerId,
      },
      select: SELECT_STUDIO,
    });

    if (!studio) {
      throw new BadRequestException('존재하지 않는 스튜디오입니다.');
    }

    return studio;
  }

  async update(id: number, updateStudioRequestDto: UpdateStudioRequestDto) {
    const { name } = updateStudioRequestDto;
    const studio = await this.prismaService.studios.update({
      where: { id },
      data: {
        name,
      },
      select: SELECT_STUDIO,
    });

    if (!studio) {
      throw new BadRequestException('존재하지 않는 스튜디오입니다.');
    }

    return studio;
  }

  async delete(id: number): Promise<void> {
    const studio = await this.prismaService.studios.delete({
      where: { id },
    });

    if (!studio) {
      throw new BadRequestException('존재하지 않는 스튜디오입니다.');
    }
  }

  async invite(id: number, inviteStudioRequestDto: InviteStudioRequestDto) {
    const { emails } = inviteStudioRequestDto;
    const studio = await this.prismaService.studios.findUnique({
      where: { id },
      select: SELECT_STUDIO,
    });

    if (!studio) {
      throw new BadRequestException('존재하지 않는 스튜디오입니다.');
    }

    for (const email of emails) {
      await this.prismaService.studioInvitations.create({
        data: {
          email,
          expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          studioId: id,
        },
      });
      this.emailService.sendStudioInvitationEmail(email, studio);
    }
  }

  async join(studioId: number, userId: number) {
    const studio = await this.prismaService.studios.findUnique({
      where: { id: studioId },
      select: SELECT_STUDIO,
    });

    if (!studio) {
      throw new BadRequestException('존재하지 않는 스튜디오입니다.');
    }

    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자입니다.');
    }

    const studioInvitation =
      await this.prismaService.studioInvitations.findFirst({
        where: {
          email: user.email,
          studioId: studioId,
          expiredAt: { gte: new Date() },
        },
      });

    if (!studioInvitation) {
      throw new BadRequestException('초대받지 않았거나 초대가 만료되었습니다.');
    }

    await this.prismaService.userStudioLinks.create({
      data: {
        userId,
        studioId: studioId,
      },
    });
  }

  async leave(studioId: number, userId: number) {
    const studio = await this.prismaService.studios.findUnique({
      where: { id: studioId },
      select: SELECT_STUDIO,
    });

    if (!studio) {
      throw new BadRequestException('존재하지 않는 스튜디오입니다.');
    }

    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자입니다.');
    }

    await this.prismaService.userStudioLinks.delete({
      where: {
        userId_studioId: {
          userId,
          studioId: studioId,
        },
      },
    });
  }

  async findByUser(userId: number, pageNumber: number, pageSize: number) {
    const studios = await this.prismaService.studios.findMany({
      where: {
        UserStudioLinks: {
          some: {
            userId,
          },
        },
      },
      select: SELECT_STUDIO,
      skip: getPageOffset(pageNumber, pageSize),
      take: pageSize,
    });

    const totalCount = await this.prismaService.studios.count({
      where: {
        UserStudioLinks: {
          some: {
            userId,
          },
        },
      },
    });

    return {
      totalCount,
      studios,
    };
  }

  async checkManager(studioId: number, userId: number) {
    const studio = await this.prismaService.studios.findUnique({
      where: { id: studioId },
      select: {
        managerId: true,
      },
    });

    if (!studio) {
      throw new BadRequestException('존재하지 않는 스튜디오입니다.');
    }

    if (studio.managerId !== userId) {
      throw new BadRequestException('해당 스튜디오의 관리자가 아닙니다.');
    }
  }
}
