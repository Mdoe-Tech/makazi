import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from '../../logging/logging.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, body, query, params } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // Log request
    this.loggingService.log(
      `Incoming ${method} request to ${originalUrl}`,
      'HTTP',
      {
        method,
        url: originalUrl,
        ip,
        userAgent,
        body: this.sanitizeBody(body),
        query,
        params,
      }
    );

    // Capture response
    const originalSend = res.send;
    res.send = function(body: any) {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Parse response body if it's a string
      let parsedBody = body;
      if (typeof body === 'string') {
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          // If parsing fails, use the original body
          parsedBody = body;
        }
      }

      // Log response
      this.loggingService.log(
        `Outgoing ${method} response from ${originalUrl}`,
        'HTTP',
        {
          method,
          url: originalUrl,
          statusCode,
          responseTime: `${responseTime}ms`,
          body: this.sanitizeBody(parsedBody),
        }
      );

      return originalSend.call(res, body);
    }.bind(this);

    next();
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;
    
    // Create a copy of the body
    const sanitized = { ...body };
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'authorization'];
    sensitiveFields.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
} 