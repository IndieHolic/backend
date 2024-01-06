import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login-request.dto';
import { LoginResponseDto } from 'src/auth/dto/login-response.dto';
import { RegisterRequestDto } from 'src/auth/dto/register-request.dto';
import { SendEmailResponseDto } from 'src/auth/dto/send-email-response';

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
    return {};
  }

  @Post('/verify')
  async verifyEmail(@Query('verifyToken') verifyToken: string) {
    return await this.authService.verifyEmail(verifyToken);
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
