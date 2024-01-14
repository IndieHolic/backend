import { Module } from '@nestjs/common';
import { GamePlayService, GameService } from './game.service';
import { GameController, GamePlayController } from './game.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [GameController, GamePlayController],
  providers: [GameService, GamePlayService],
})
export class GameModule {}
