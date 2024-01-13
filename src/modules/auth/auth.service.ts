import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequestDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/config/database/prisma.service';
import { Users } from '@prisma/client';
import { RegisterRequestDto } from 'src/modules/auth/dtos/register.dto';
import * as uuid from 'uuid';
import { EmailService } from 'src/modules/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async login(loginRequsetDto: LoginRequestDto) {
    const user: Users = await this.prismaService.users.findUnique({
      where: {
        email: loginRequsetDto.email,
      },
    });

    if (
      !user ||
      !(await bcrypt.compare(loginRequsetDto.password, user.password))
    ) {
      throw new UnauthorizedException(
        '이메일 혹은 비밀번호가 올바르지 않습니다.',
      );
    }

    return this.jwtService.sign({
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }

  async createUser(registerRequestDto: RegisterRequestDto) {
    const { email, password, name, verifyId } = registerRequestDto;

    if (await this.prismaService.users.findUnique({ where: { email } })) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const emailVerification =
      await this.prismaService.emailVerifications.findUnique({
        where: { id: verifyId },
      });

    if (!emailVerification || !emailVerification.isVerified) {
      throw new UnauthorizedException('이메일 인증이 완료되지 않았습니다.');
    }

    if (emailVerification.email !== email) {
      throw new UnauthorizedException(
        '인증한 이메일과 다른 이메일로 가입할 수 없습니다.',
      );
    }

    await this.prismaService.users.create({
      data: {
        email,
        password: this.createHash(password),
        name,
      },
    });
  }

  async sendVerifyEmail(email: string) {
    if (await this.prismaService.users.findUnique({ where: { email } })) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const verifyToken = uuid.v1();

    const emailVerification =
      await this.prismaService.emailVerifications.create({
        data: {
          email,
          token: verifyToken,
          expiredAt: new Date(Date.now() + 1000 * 60 * 10),
        },
      });

    await this.emailService.sendVerifyEmail(email, verifyToken);

    return emailVerification;
  }

  async verifyEmail(verifyToken: string) {
    const emailVerification =
      await this.prismaService.emailVerifications.findUnique({
        where: {
          token: verifyToken,
        },
      });

    if (!emailVerification) {
      throw new UnauthorizedException('인증 토큰이 올바르지 않습니다.');
    }

    if (emailVerification.expiredAt < new Date()) {
      throw new UnauthorizedException('인증 토큰이 만료되었습니다.');
    }

    if (emailVerification.isVerified) {
      throw new BadRequestException('이미 인증되었습니다.');
    }

    await this.prismaService.emailVerifications.update({
      where: {
        token: verifyToken,
      },
      data: {
        isVerified: true,
      },
    });

    return {};
  }

  createHash(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}
