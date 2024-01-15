import { PageDto } from 'src/common/dtos/pagination.dto';
import { UserDto } from 'src/modules/user/dtos/user.dto';

export abstract class GameReviewDto {
  id: number;
  user: UserDto;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class CreateGameReviewRequestDto {
  content: string;
}

export abstract class CreateGameReviewResponseDto extends GameReviewDto {}

export abstract class UpdateGameReviewRequestDto {
  content: string;
}

export abstract class UpdateGameReviewResponseDto extends GameReviewDto {}

export abstract class GetGameReviewResponseDto extends GameReviewDto {}

export abstract class GetGameReviewListResponseDto extends PageDto<GameReviewDto> {}
