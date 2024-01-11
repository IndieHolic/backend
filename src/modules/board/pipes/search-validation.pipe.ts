import {
  ArgumentMetadata,
  BadRequestException,
  ForbiddenException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class SearchValidationPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      return value;
    } else if (value == undefined) {
      return value;
    }

    throw new BadRequestException('search must be undefined or string');
  }
}
