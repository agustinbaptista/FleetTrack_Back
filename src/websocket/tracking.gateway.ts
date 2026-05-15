import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app-logger.service';
import { Alert } from '@/alerts/alert.entity';
import { Location } from '@/tracking/location.entity';

@Injectable()
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'tracking',
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly logger: AppLogger) {}

  handleConnection(client: Socket): void {
    this.logger.log(`WS connected: ${client.id}`, 'WEBSOCKET');
    this.server.emit('vehicleConnected', { clientId: client.id, connectedAt: new Date().toISOString() });
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`WS disconnected: ${client.id}`, 'WEBSOCKET');
    this.server.emit('vehicleDisconnected', {
      clientId: client.id,
      disconnectedAt: new Date().toISOString(),
    });
  }

  emitVehicleLocation(location: Location): void {
    this.server.emit('vehicleLocation', location);
  }

  emitVehicleAlert(alert: Alert): void {
    this.server.emit('vehicleAlert', alert);
  }

  emitVehicleDisconnected(vehicleId: string): void {
    this.server.emit('vehicleDisconnected', { vehicleId, disconnectedAt: new Date().toISOString() });
  }
}

