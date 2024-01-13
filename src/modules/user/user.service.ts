import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma.service';
import { SELECT_USER } from 'src/modules/user/constants/select.constant';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async find(id: number) {
    const user = await this.prismaService.users.findUnique({
      where: { id },
      select: SELECT_USER,
    });

    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자입니다.');
    }

    return user;
  }
}
