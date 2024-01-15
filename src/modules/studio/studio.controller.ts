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
import { checkNumber } from 'src/common/utils/exception.utils';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import {
  CreateStudioRequestDto,
  CreateStudioResponseDto,
} from 'src/modules/studio/dtos/create-studio.dto';
import { GetJoinedStudioResponseDto } from 'src/modules/studio/dtos/get-joined-studio.dto';
import { GetStudioResponseDto } from 'src/modules/studio/dtos/get-studio.dto';
import { InviteStudioRequestDto } from 'src/modules/studio/dtos/invite-studio.dto';
import {
  UpdateStudioRequestDto,
  UpdateStudioResponseDto,
} from 'src/modules/studio/dtos/update-studio.dto';
import { StudioService } from 'src/modules/studio/studio.service';

@Controller('studio')
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  @Get('/joined')
  @UseGuards(JwtGuard)
  async getJoinedStudio(
    @CurrentUser() currentUser: Users,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
  ): Promise<GetJoinedStudioResponseDto> {
    checkNumber(pageNumber);
    checkNumber(pageSize);
    const { totalCount, studios } = await this.studioService.findByUser(
      currentUser.id,
      Number(pageNumber),
      Number(pageSize),
    );
    return new PageDto(
      Number(pageNumber),
      Number(pageSize),
      totalCount,
      studios,
    );
  }

  @Get('/:id')
  async getStudio(@Param('id') id: string): Promise<GetStudioResponseDto> {
    checkNumber(id);
    return await this.studioService.find(Number(id));
  }

  @Post()
  @UseGuards(JwtGuard)
  async createStudio(
    @Body() createStudioRequestDto: CreateStudioRequestDto,
    @CurrentUser() currentUser: Users,
  ): Promise<CreateStudioResponseDto> {
    return await this.studioService.create(
      currentUser.id,
      createStudioRequestDto,
    );
  }

  @Patch('/:id')
  @UseGuards(JwtGuard)
  async updateStudio(
    @Param('id') id: string,
    @Body() updateStudioRequestDto: UpdateStudioRequestDto,
    @CurrentUser() currentUser: Users,
  ): Promise<UpdateStudioResponseDto> {
    checkNumber(id);
    this.studioService.checkManager(Number(id), currentUser.id);
    return await this.studioService.update(Number(id), updateStudioRequestDto);
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  async deleteStudio(
    @Param('id') id: string,
    @CurrentUser() currentUser: Users,
  ) {
    checkNumber(id);
    this.studioService.checkManager(Number(id), currentUser.id);
    await this.studioService.delete(Number(id));
  }

  @Post('/:id/invite')
  @UseGuards(JwtGuard)
  async inviteStudio(
    @Param('id') id: string,
    @Body() inviteStudioRequestDto: InviteStudioRequestDto,
    @CurrentUser() currentUser: Users,
  ) {
    checkNumber(id);
    this.studioService.checkManager(Number(id), currentUser.id);
    await this.studioService.invite(
      Number(id),
      inviteStudioRequestDto,
      currentUser,
    );
  }

  @Post('/:id/join')
  @UseGuards(JwtGuard)
  async joinStudio(@Param('id') id: string, @CurrentUser() currentUser: Users) {
    checkNumber(id);
    await this.studioService.join(Number(id), currentUser.id);
  }

  @Delete('/:id/leave')
  @UseGuards(JwtGuard)
  async leaveStudio(
    @Param('id') id: string,
    @CurrentUser() currentUser: Users,
  ) {
    checkNumber(id);
    await this.studioService.leave(Number(id), currentUser.id);
  }
}
