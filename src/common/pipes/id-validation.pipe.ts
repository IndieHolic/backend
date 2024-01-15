import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      keys.forEach((key) => {
        if (key.includes('id') || key.includes('Id')) {
          if (typeof value[key] === 'string') {
            value[key] = parseInt(value[key]);
          }

          if (typeof value[key] === 'number' && value[key] > 0) {
            return value;
          } else {
          }
        }
      });
      return value;
    } else if (typeof value === 'string') {
      value = parseInt(value);
      if (value > 0) {
        return value;
      }
    } else if (typeof value === 'number') {
      if (value > 0) {
        return value;
      }
    }
    throw new BadRequestException('Id must be a positive number');
  }
}
