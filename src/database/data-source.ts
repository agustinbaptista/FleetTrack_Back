import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../auth/user.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Location } from '../tracking/location.entity';
import { Alert } from '../alerts/alert.entity';

const databaseUrl = process.env.DATABASE_URL;

export default new DataSource({
  type: 'postgres',
  ...(databaseUrl
    ? {
        url: databaseUrl,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }),
  entities: [User, Vehicle, Location, Alert],
  migrations: ['src/database/migrations/*.ts'],
});
