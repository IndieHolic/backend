export abstract class UserDto {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
