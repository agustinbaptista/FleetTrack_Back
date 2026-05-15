import { Module } from '@nestjs/common';
import { TrackingGateway } from './tracking.gateway';
import { AppLogger } from '@/common/logger/app-logger.service';

@Module({
  providers: [TrackingGateway, AppLogger],
  exports: [TrackingGateway],
})
export class WebsocketModule {}

