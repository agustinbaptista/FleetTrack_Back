import { Module, forwardRef } from '@nestjs/common';
import { SimulatorService } from './simulator.service';
import { TrackingModule } from '@/tracking/tracking.module';
import { VehiclesModule } from '@/vehicles/vehicles.module';
import { WebsocketModule } from '@/websocket/websocket.module';
import { RedisModule } from '@/redis/redis.module';
import { AppLogger } from '@/common/logger/app-logger.service';

@Module({
  imports: [forwardRef(() => TrackingModule), VehiclesModule, WebsocketModule, RedisModule],
  providers: [SimulatorService, AppLogger],
})
export class SimulatorModule {}
