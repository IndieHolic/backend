import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Users } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { selectKeys } from 'src/common/utils/dict.util';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { GetMeResponseDto } from 'src/modules/user/dto/get-me-response.dto copy';
import { GetUserResponseDto } from 'src/modules/user/dto/get-user-response.dto';
import { UserService } from 'src/modules/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseGuards(JwtGuard)
  async getMe(@CurrentUser() currentUser: Users): Promise<GetMeResponseDto> {
    return selectKeys(currentUser, [
      'id',
      'email',
      'name',
      'isAdmin',
      'createdAt',
      'updatedAt',
    ]);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<GetUserResponseDto> {
    if (isNaN(Number(id))) {
      throw new BadRequestException('id 형식이 올바르지 않습니다.');
    }

    return await this.userService.findOne(Number(id));
  }
}
