import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTrackingSchema1710000000000 implements MigrationInterface {
  name = 'InitTrackingSchema1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'operator', 'client')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'client', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_users_email" UNIQUE ("email"), CONSTRAINT "PK_users_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plate" character varying NOT NULL, "model" character varying NOT NULL, "driverName" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'offline', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_vehicles_plate" UNIQUE ("plate"), CONSTRAINT "PK_vehicles_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "alerts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vehicleId" uuid NOT NULL, "type" character varying NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_alerts_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vehicleId" uuid NOT NULL, "latitude" numeric(10,7) NOT NULL, "longitude" numeric(10,7) NOT NULL, "speed" numeric(6,2) NOT NULL DEFAULT '0', "fuelLevel" numeric(5,2) NOT NULL DEFAULT '100', "engineStatus" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_locations_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_locations_vehicle_created" ON "locations" ("vehicleId", "createdAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_alerts_vehicle_created" ON "alerts" ("vehicleId", "createdAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "locations" ADD CONSTRAINT "FK_locations_vehicle" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "locations" DROP CONSTRAINT "FK_locations_vehicle"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_alerts_vehicle_created"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_locations_vehicle_created"`);
    await queryRunner.query(`DROP TABLE "locations"`);
    await queryRunner.query(`DROP TABLE "alerts"`);
    await queryRunner.query(`DROP TABLE "vehicles"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
