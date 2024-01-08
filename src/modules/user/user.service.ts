import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma.service';
import { GetUserResponseDto } from 'src/modules/user/dto/get-user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: number): Promise<GetUserResponseDto> {
    const user = await this.prismaService.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자입니다.');
    }

    return user;
  }
}
