import { PageDto } from 'src/common/dtos/pagination.dto';
import { UserDto } from 'src/modules/user/dtos/user.dto';

export abstract class GameReviewReplyDto {
  id: number;
  user: UserDto;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class CreateGameReviewReplyRequestDto {
  content: string;
}

export abstract class CreateGameReviewReplyResponseDto extends GameReviewReplyDto {}

export abstract class UpdateGameReviewReplyRequestDto {
  content: string;
}

export abstract class UpdateGameReviewReplyResponseDto extends GameReviewReplyDto {}

export abstract class GetGameReviewReplyResponseDto extends GameReviewReplyDto {}

export abstract class GetGameReviewReplyListResponseDto extends PageDto<GameReviewReplyDto> {}
