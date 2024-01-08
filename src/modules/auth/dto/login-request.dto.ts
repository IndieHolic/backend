import { IsString, IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
