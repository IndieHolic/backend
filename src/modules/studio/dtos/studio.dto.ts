import { UserDto } from 'src/modules/user/dtos/user.dto';

export abstract class StudioDto {
  id: number;
  name: string;
  manager: UserDto;
  createdAt: Date;
  updatedAt: Date;
}
