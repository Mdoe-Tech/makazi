import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as swMessages from '../../i18n/sw/sw.json';

export interface ValidationPipeOptions {
  transform?: boolean;
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private readonly shouldTransform: boolean;

  constructor(options?: ValidationPipeOptions) {
    this.shouldTransform = options?.transform ?? false;
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value, {
      enableImplicitConversion: this.shouldTransform
    });
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = errors.map(error => {
        const constraints = error.constraints;
        const field = swMessages.fields[error.property] || error.property;
        
        return Object.values(constraints).map(constraint => {
          let message = swMessages.validation[constraint.split(' ')[0]];
          if (!message) return constraint;

          message = message.replace('{{field}}', field);
          
          if (constraint.includes('enum')) {
            const enumValues = Object.values(swMessages.enums[error.property] || {});
            message = message.replace('{{values}}', enumValues.join(', '));
          }

          return message;
        });
      }).flat();

      throw new BadRequestException(messages);
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
} 