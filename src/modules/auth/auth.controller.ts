import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import {
  LoginRequestDto,
  LoginResponseDto,
} from 'src/modules/auth/dtos/login.dto';
import { RegisterRequestDto } from 'src/modules/auth/dtos/register.dto';
import { SendEmailResponseDto } from 'src/modules/auth/dtos/send-email';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() loginRequsetDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    const accessToken = await this.authService.login(loginRequsetDto);
    return {
      accessToken,
    };
  }

  @Post('/register')
  async register(@Body() registerRequestDto: RegisterRequestDto) {
    await this.authService.createUser(registerRequestDto);
  }

  @Post('/verify')
  async verifyEmail(@Query('verifyToken') verifyToken: string) {
    await this.authService.verifyEmail(verifyToken);
  }

  @Post('/send-verify')
  async sendVerifyEmail(
    @Query('email') email: string,
  ): Promise<SendEmailResponseDto> {
    const emailVerification = await this.authService.sendVerifyEmail(email);
    return {
      verifyId: emailVerification.id,
    };
  }
}
