export function getPageOffset(pageNumber: number, pageSize: number) {
  return (pageNumber - 1) * pageSize;
}
