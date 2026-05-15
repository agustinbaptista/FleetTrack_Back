import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateLocationDto } from './dto/create-location.dto';
import { TrackingService } from './tracking.service';

@ApiTags('tracking')
@ApiBearerAuth()
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('location')
  createLocation(@Body() dto: CreateLocationDto) {
    return this.trackingService.registerLocation(dto);
  }

  @Get('history/:vehicleId')
  getHistory(@Param('vehicleId') vehicleId: string) {
    return this.trackingService.getHistory(vehicleId);
  }

  @Get('latest/:vehicleId')
  getLatest(@Param('vehicleId') vehicleId: string) {
    return this.trackingService.getLatest(vehicleId);
  }
}

