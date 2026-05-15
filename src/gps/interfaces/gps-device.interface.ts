export interface GpsPayload {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  fuelLevel: number;
  engineStatus: boolean;
}

export interface GpsDeviceAdapter {
  start(): Promise<void>;
  stop(): Promise<void>;
  onMessage(handler: (payload: GpsPayload) => Promise<void>): void;
}

