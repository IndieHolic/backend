export abstract class MainBannerDto {
  id: number;
  startAt: Date;
  endAt: Date;
  link: string;
  title?: string;
  iconImage?: string;
  backgroundImage?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
