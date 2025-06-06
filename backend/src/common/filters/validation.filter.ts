import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { LoggingService } from '../../logging/logging.service';

@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    // Log validation error with more details
    this.loggingService.warn(
      `Validation error in ${request.method} ${request.url}`,
      'Validation',
      {
        errors: exceptionResponse.message,
        requestData: {
          body: request.body,
          query: (request as any).query,
          params: (request as any).params,
        },
        validationRules: {
          username: 'min length 3',
          password: 'min length 8, must contain uppercase, lowercase, number and special character',
          email: 'must be valid email',
          phone_number: 'must start with +255 followed by 9 digits',
          role: 'must be a valid Role enum value',
          permissions: 'must be an object with boolean fields'
        }
      }
    );

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exceptionResponse.message,
      });
  }
} 