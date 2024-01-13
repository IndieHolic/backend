import { BadRequestException, Injectable } from '@nestjs/common';
import { getPageOffset } from 'src/common/utils/pagination.util';
import { PrismaService } from 'src/config/database/prisma.service';
import { SELECT_MAIN_BANNER } from 'src/modules/main-banner/constants/select.constant';
import { CreateMainBannerRequestDto } from 'src/modules/main-banner/dtos/create-main-banner.dto';
import { UpdateMainBannerRequestDto } from 'src/modules/main-banner/dtos/update-main-banner.dto';

@Injectable()
export class MainBannerService {
  constructor(private readonly prismaService: PrismaService) {}

  async find(id: number) {
    const mainBanner = await this.prismaService.mainBanners.findUnique({
      where: { id },
      select: SELECT_MAIN_BANNER,
    });

    if (!mainBanner) {
      throw new BadRequestException('존재하지 않는 배너입니다.');
    }

    return mainBanner;
  }

  async getCurrents(pageNumber: number, pageSize: number) {
    const currentDateTime = new Date();
    const mainBanners = await this.prismaService.mainBanners.findMany({
      skip: getPageOffset(pageNumber, pageSize),
      take: pageSize,
      select: SELECT_MAIN_BANNER,
      where: {
        startAt: {
          lte: currentDateTime,
        },
        endAt: {
          gte: currentDateTime,
        },
      },
    });
    const totalCount = await this.prismaService.mainBanners.count({
      where: {
        startAt: {
          lte: currentDateTime,
        },
        endAt: {
          gte: currentDateTime,
        },
      },
    });

    return {
      totalCount,
      mainBanners,
    };
  }

  async create(createMainBannerRequestDto: CreateMainBannerRequestDto) {
    const {
      startAt,
      endAt,
      link,
      title,
      iconImage,
      backgroundImage,
      description,
    } = createMainBannerRequestDto;

    const mainBanner = await this.prismaService.mainBanners.create({
      data: {
        startAt,
        endAt,
        link,
        title,
        iconImage,
        backgroundImage,
        description,
      },
      select: SELECT_MAIN_BANNER,
    });

    return mainBanner;
  }

  async update(
    id: number,
    updateMainBannerRequestDto: UpdateMainBannerRequestDto,
  ) {
    const {
      startAt,
      endAt,
      link,
      title,
      iconImage,
      backgroundImage,
      description,
    } = updateMainBannerRequestDto;

    const mainBanner = await this.prismaService.mainBanners.update({
      where: { id },
      data: {
        startAt,
        endAt,
        link,
        title,
        iconImage,
        backgroundImage,
        description,
      },
      select: SELECT_MAIN_BANNER,
    });

    if (!mainBanner) {
      throw new BadRequestException('존재하지 않는 배너입니다.');
    }

    return mainBanner;
  }

  async delete(id: number) {
    const mainBanner = await this.prismaService.mainBanners.delete({
      where: { id },
    });

    if (!mainBanner) {
      throw new BadRequestException('존재하지 않는 배너입니다.');
    }
  }
}
