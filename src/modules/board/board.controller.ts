import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { BoardService, InfoBoardService } from "./board.service";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Users } from "@prisma/client";
import { BoardCreateDto } from "./dto/create-board.dto";

@Controller("board")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Delete("/:boardId")
  @UseGuards(JwtGuard)
  delete(@CurrentUser() user: Users, @Param("boardId") boardId: number) {
    return this.boardService.delete(user.id, boardId);
  }

  @Post("/like/:boardId")
  @UseGuards(JwtGuard)
  createLike(@CurrentUser() user: Users, @Param("boardId") boardId: number) {
    return this.boardService.createLike(user.id, boardId);
  }

  @Post("/dislike/:boardId")
  @UseGuards(JwtGuard)
  createDislike(@CurrentUser() user: Users, @Param("boardId") boardId: number) {
    return;
  }

  @Delete("/like/:boardId")
  @UseGuards(JwtGuard)
  deleteLike(@CurrentUser() user: Users, @Param("boardId") boardId: number) {}

  @Delete("/dislike/:boardId")
  @UseGuards(JwtGuard)
  deleteDislike(
    @CurrentUser() user: Users,
    @Param("boardId") boardId: number,
  ) {}
}

@Controller("board/info")
export class InfoBoardController {
  constructor(private readonly infoBoardService: InfoBoardService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@CurrentUser() user: Users, @Body() createBoardDto: BoardCreateDto) {
    return this.infoBoardService.create(user.id, createBoardDto);
  }
}
