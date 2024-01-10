import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Users } from '@prisma/client';

export function checkNumber(id: string) {
  if (isNaN(Number(id))) {
    throw new BadRequestException('숫자 형식이 아닙니다.');
  }
}

export function checkAdmin(user: Users) {
  if (!user.isAdmin) {
    throw new UnauthorizedException('관리자만 접근할 수 있습니다.');
  }
}

export function checkUser(user: Users, userId: number) {
  if (user.id !== userId) {
    throw new UnauthorizedException('권한이 없습니다.');
  }
}
