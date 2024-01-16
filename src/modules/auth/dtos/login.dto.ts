import { IsString, IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  email: string;

  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export abstract class LoginResponseDto {
  accessToken: string;
}
