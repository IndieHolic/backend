import { Module } from '@nestjs/common';
import { UserController } from 'src/modules/user/user.controller';
import { UserService } from 'src/modules/user/user.service';

@Module({
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
