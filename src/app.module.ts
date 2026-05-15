import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { TrackingModule } from './tracking/tracking.module';
import { AlertsModule } from './alerts/alerts.module';
import { WebsocketModule } from './websocket/websocket.module';
import { SimulatorModule } from './simulator/simulator.module';
import { RedisModule } from './redis/redis.module';
import { AppLogger } from './common/logger/app-logger.service';
import { GpsModule } from './gps/gps.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        return {
          type: 'postgres' as const,
          ...(databaseUrl
            ? {
                url: databaseUrl,
                ssl: {
                  rejectUnauthorized: false,
                },
              }
            : {
                host: config.get<string>('DB_HOST'),
                port: Number(config.get<string>('DB_PORT')),
                username: config.get<string>('DB_USER'),
                password: config.get<string>('DB_PASSWORD'),
                database: config.get<string>('DB_NAME'),
              }),
          autoLoadEntities: true,
          synchronize: false,
        };
      },
    }),
    RedisModule,
    AuthModule,
    VehiclesModule,
    TrackingModule,
    AlertsModule,
    WebsocketModule,
    SimulatorModule,
    GpsModule,
  ],
  providers: [
    AppLogger,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
