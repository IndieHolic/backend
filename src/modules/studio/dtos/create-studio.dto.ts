import { IsNotEmpty, IsString } from 'class-validator';
import { StudioDto } from 'src/modules/studio/dtos/studio.dto';

export abstract class CreateStudioRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export abstract class CreateStudioResponseDto extends StudioDto {}
