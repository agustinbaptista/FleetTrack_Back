import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppLogger } from '../logger/app-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request?.method;
    const path = request?.url;
    return next.handle().pipe(
      tap(() => {
        this.logger.log(`${method} ${path} ${Date.now() - now}ms`, 'HTTP');
      }),
    );
  }
}

