export class PageDto<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  content: T[];

  constructor(
    pageNumber: number,
    pageSize: number,
    totalCount: number,
    content: T[],
  ) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.totalPages = Math.ceil(totalCount / pageSize);
    this.content = content;
  }
}
