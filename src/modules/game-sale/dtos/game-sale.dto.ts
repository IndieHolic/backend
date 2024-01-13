export abstract class GameSaleDto {
  id: number;
  gameId: number;
  percent: number;
  startAt: Date;
  endAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
