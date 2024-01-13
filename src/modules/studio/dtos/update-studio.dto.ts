import { IsNotEmpty, IsString } from 'class-validator';
import { StudioDto } from 'src/modules/studio/dtos/studio.dto';

export abstract class UpdateStudioRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export abstract class UpdateStudioResponseDto extends StudioDto {}
