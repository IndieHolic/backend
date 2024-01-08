import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BoardService, InfoBoardService } from './board.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Users } from '@prisma/client';
import { BoardCreateDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Delete('/:boardId')
  @UseGuards(JwtGuard)
  delete(@CurrentUser() user: Users, @Param('boardId') boardId: number) {
    return this.boardService.delete(user.id, boardId);
  }

  @Post('/like/:boardId')
  @UseGuards(JwtGuard)
  createLike(
    @CurrentUser() user: Users,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.boardService.createLike(user.id, boardId);
  }

  @Post('/dislike/:boardId')
  @UseGuards(JwtGuard)
  createDislike(
    @CurrentUser() user: Users,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.boardService.createDislike(user.id, boardId);
  }

  @Delete('/like/:boardId')
  @UseGuards(JwtGuard)
  deleteLike(
    @CurrentUser() user: Users,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.boardService.deleteLike(user.id, boardId);
  }

  @Delete('/dislike/:boardId')
  @UseGuards(JwtGuard)
  deleteDislike(
    @CurrentUser() user: Users,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.boardService.deleteDislike(user.id, boardId);
  }
}

@Controller('board/info')
export class InfoBoardController {
  constructor(private readonly infoBoardService: InfoBoardService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@CurrentUser() user: Users, @Body() createBoardDto: BoardCreateDto) {
    return this.infoBoardService.create(user.id, createBoardDto);
  }

  @Patch(':boardId')
  @UseGuards(JwtGuard)
  update(
    @CurrentUser() user: Users,
    @Param('boardId') boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.infoBoardService.update(user.id, boardId, updateBoardDto);
  }
}
