import { PageDto } from 'src/common/dtos/pagination.dto';
import { MainBannerDto } from 'src/modules/main-banner/dtos/main-banner.dto';

export abstract class GetCurrentMainBannerListResponseDto extends PageDto<MainBannerDto> {}
