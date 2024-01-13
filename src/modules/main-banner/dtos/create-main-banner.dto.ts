import { IsDateString, IsOptional, IsString } from 'class-validator';
import { MainBannerDto } from 'src/modules/main-banner/dtos/main-banner.dto';

export abstract class CreateMainBannerRequestDto {
  @IsDateString()
  startAt: string;

  @IsDateString()
  endAt: string;

  @IsString()
  link: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  iconImage?: string;

  @IsString()
  @IsOptional()
  backgroundImage?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export abstract class CreateMainBannerResponseDto extends MainBannerDto {}
