import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TagParsePipe implements PipeTransform {
  transform(value: any) {
    if (value.tags && Array.isArray(value.tags)) {
      throw new BadRequestException('tags must be an array or null');
    }

    if (!value.tags) {
      value.tags = '';
      return value;
    }

    value.tags = value.tags.join();
    return value;
  }
}
