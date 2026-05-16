import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './location.entity';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { AlertsModule } from '../alerts/alerts.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location]),
    VehiclesModule,
    AlertsModule,
    WebsocketModule,
    RedisModule,
  ],
  providers: [TrackingService],
  controllers: [TrackingController],
  exports: [TrackingService],
})
export class TrackingModule {}

