# Tracking Vehiculos Backend (NestJS)

Backend enterprise para tracking de vehiculos en tiempo real con NestJS + TypeScript.

## Stack
- NestJS + TypeScript
- PostgreSQL + TypeORM
- Redis
- Socket.IO
- JWT Auth (roles: `admin`, `operator`, `client`)
- Swagger

## Estructura
```text
back/src
  auth/
  vehicles/
  tracking/
  alerts/
  websocket/
  simulator/
  gps/
  redis/
  common/
  database/
```

## Instalacion
```bash
cd back
npm install
cp .env.example .env
```

## Variables de entorno
```env
DATABASE_URL=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
REDIS_HOST=
REDIS_PORT=
PORT=3000
```

`DATABASE_URL` tiene prioridad (ideal para Neon/Vercel). Si no existe, se usa el bloque `DB_*`.

## Base de datos
```bash
npm run migration:run
npm run seed
```

## Ejecutar
```bash
npm run start:dev
```

## Swagger
- URL: `http://localhost:3000/docs`

## Auth
- `POST /auth/register`
- `POST /auth/login`

## Vehicles
- `POST /vehicles`
- `GET /vehicles`
- `GET /vehicles/:id`
- `PATCH /vehicles/:id`
- `DELETE /vehicles/:id`

## Tracking
- `POST /tracking/location`
- `GET /tracking/history/:vehicleId`
- `GET /tracking/latest/:vehicleId`

## Alerts
- `GET /alerts/:vehicleId`

## Eventos WebSocket (namespace `/tracking`)
- `vehicleLocation`
- `vehicleConnected`
- `vehicleDisconnected`
- `vehicleAlert`

## Caracteristicas clave
- Guarda cada ubicacion en PostgreSQL.
- Cachea ultima ubicacion y estado online en Redis.
- Calcula distancia recorrida por vehiculo (Redis key `vehicle:<id>:distance_km`).
- Geofencing basico (area definida en `TrackingService`).
- Alertas automaticas:
  - Exceso velocidad (`>120`)
  - Vehiculo detenido mucho tiempo
  - Desconexion (simulada)
- Simulador GPS desacoplado con envio cada 5 segundos.
- Preparado para integrar GPS real por adapters HTTP/MQTT/TCP (`src/gps/adapters`).

## Seguridad y observabilidad
- `helmet`
- CORS habilitado
- Rate limiting global con `@nestjs/throttler`
- Request logging + error logging + websocket logging
- DTOs + `class-validator` + `ValidationPipe`
