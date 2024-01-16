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
    const { email, userId, password } = loginRequsetDto;

    if ((email && userId) || (!email && !userId)) {
      throw new BadRequestException('이메일과 아이디 중 하나만 입력해주세요.');
    }

    const user: Users = await this.prismaService.users.findUnique({
      where: {
        email: loginRequsetDto.email,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
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
    const { email, userId, password, name, verifyId } = registerRequestDto;

    this.checkUserId(userId);
    this.checkPassword(password);

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
        userId,
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

  private checkUserId(userId: string) {
    if (userId.length < 4 || userId.length > 16) {
      throw new BadRequestException(
        '아이디는 4자 이상 20자 이하로 설정해주세요.',
      );
    }

    if (!userId.match(/^[a-zA-Z0-9]+$/)) {
      throw new BadRequestException(
        '아이디는 영문, 숫자만 사용할 수 있습니다.',
      );
    }
  }

  private checkPassword(password: string) {
    if (password.length < 8 || password.length > 16) {
      throw new BadRequestException(
        '비밀번호는 영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 8~16글자로 설정해주세요.',
      );
    }

    const english = /[a-zA-Z]/;
    const numbers = /[0-9]/;
    const specialChars = /[^A-Za-z0-9]/;

    let count = 0;
    if (english.test(password)) count++;
    if (numbers.test(password)) count++;
    if (specialChars.test(password)) count++;

    if (count < 2) {
      throw new BadRequestException(
        '비밀번호는 영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 8~16글자로 설정해주세요.',
      );
    }
  }

  createHash(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}
