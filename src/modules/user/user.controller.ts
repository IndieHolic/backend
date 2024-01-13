import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Users } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { selectKeys } from 'src/common/utils/json.util';
import { checkNumber } from 'src/common/utils/exception.utils';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { GetMeResponseDto } from 'src/modules/user/dtos/get-me.dto';
import { GetUserResponseDto } from 'src/modules/user/dtos/get-user.dto';
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
    checkNumber(id);
    return await this.userService.find(Number(id));
  }
}
