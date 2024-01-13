import { PageDto } from 'src/common/dtos/pagination.dto';
import { StudioDto } from 'src/modules/studio/dtos/studio.dto';

export abstract class GetJoinedStudioResponseDto extends PageDto<StudioDto> {}
