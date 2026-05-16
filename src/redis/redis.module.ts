import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';
import { AppLogger } from '../common/logger/app-logger.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService, AppLogger],
      useFactory: (config: ConfigService, logger: AppLogger) => {
        const host = config.get<string>('REDIS_HOST') ?? '127.0.0.1';
        const rawPort = config.get<string>('REDIS_PORT');
        const parsedPort = rawPort ? Number(rawPort) : 6379;
        const port = Number.isFinite(parsedPort) ? parsedPort : 6379;
        let unavailableWarned = false;

        const client = new Redis({
          host,
          port,
        });
        client.on('error', (err) => {
          if (!unavailableWarned) {
            logger.warn(`Redis unavailable: ${err.message}`, 'REDIS');
            unavailableWarned = true;
          }
        });
        return client;
      },
    },
    AppLogger,
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
