import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Users } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PageDto } from 'src/common/dtos/pagination.dto';
import { checkAdmin, checkNumber } from 'src/common/utils/exception.utils';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import {
  CreateMainBannerRequestDto,
  CreateMainBannerResponseDto,
} from 'src/modules/main-banner/dtos/create-main-banner.dto';
import { GetCurrentMainBannerListResponseDto } from 'src/modules/main-banner/dtos/get-current-main-banner-list.dto';
import { GetMainBannerResponseDto } from 'src/modules/main-banner/dtos/get-main-banner.dto';
import {
  UpdateMainBannerRequestDto,
  UpdateMainBannerResponseDto,
} from 'src/modules/main-banner/dtos/update-main-banner.dto';
import { MainBannerService } from 'src/modules/main-banner/main-banner.service';

@Controller('main-banner')
export class MainBannerController {
  constructor(private readonly mainBannerService: MainBannerService) {}

  @Get('/current')
  async getCurrentMainBannerList(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
  ): Promise<GetCurrentMainBannerListResponseDto> {
    checkNumber(pageNumber);
    checkNumber(pageSize);
    const { mainBanners, totalCount } =
      await this.mainBannerService.getCurrents(
        Number(pageNumber),
        Number(pageSize),
      );

    return new PageDto(
      Number(pageNumber),
      Number(pageSize),
      totalCount,
      mainBanners,
    );
  }

  @Get('/:id')
  async getMainBanner(
    @Param('id') id: string,
  ): Promise<GetMainBannerResponseDto> {
    checkNumber(id);
    return await this.mainBannerService.find(Number(id));
  }

  @Post()
  @UseGuards(JwtGuard)
  async createMainBanner(
    @Body() createMainBannerRequestDto: CreateMainBannerRequestDto,
    @CurrentUser() currentUser: Users,
  ): Promise<CreateMainBannerResponseDto> {
    checkAdmin(currentUser);
    return await this.mainBannerService.create(createMainBannerRequestDto);
  }

  @Patch('/:id')
  @UseGuards(JwtGuard)
  async updateMainBanner(
    @Param('id') id: string,
    @Body() updateMainBannerRequestDto: UpdateMainBannerRequestDto,
    @CurrentUser() currentUser: Users,
  ): Promise<UpdateMainBannerResponseDto> {
    checkNumber(id);
    checkAdmin(currentUser);
    return await this.mainBannerService.update(
      Number(id),
      updateMainBannerRequestDto,
    );
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  async deleteMainBanner(
    @Param('id') id: string,
    @CurrentUser() currentUser: Users,
  ) {
    checkNumber(id);
    checkAdmin(currentUser);
    await this.mainBannerService.delete(Number(id));
  }
}
