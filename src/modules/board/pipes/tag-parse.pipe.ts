import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class TagParsePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.tags && Array.isArray(value.tags)) {
      throw new BadRequestException();
    }

    if (!value.tags) {
      value.tags = '';
      return value;
    }

    value.tags = value.tags.join();
    return value;
  }
}
