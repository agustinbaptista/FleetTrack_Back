import { Module } from '@nestjs/common';
import { HttpDeviceAdapter } from './adapters/http-device.adapter';
import { MqttDeviceAdapter } from './adapters/mqtt-device.adapter';
import { TcpDeviceAdapter } from './adapters/tcp-device.adapter';

@Module({
  providers: [HttpDeviceAdapter, MqttDeviceAdapter, TcpDeviceAdapter],
  exports: [HttpDeviceAdapter, MqttDeviceAdapter, TcpDeviceAdapter],
})
export class GpsModule {}

