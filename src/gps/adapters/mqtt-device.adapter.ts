import { Injectable } from '@nestjs/common';
import { GpsDeviceAdapter, GpsPayload } from '../interfaces/gps-device.interface';

@Injectable()
export class MqttDeviceAdapter implements GpsDeviceAdapter {
  private handler?: (payload: GpsPayload) => Promise<void>;
  async start(): Promise<void> {}
  async stop(): Promise<void> {}
  onMessage(handler: (payload: GpsPayload) => Promise<void>): void {
    this.handler = handler;
  }
}

