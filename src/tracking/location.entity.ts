import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vehicle } from '../vehicles/vehicle.entity';

@Entity('locations')
@Index(['vehicleId', 'createdAt'])
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  vehicleId!: string;

  @ManyToOne(() => Vehicle, { onDelete: 'CASCADE' })
  vehicle!: Vehicle;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude!: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude!: number;

  @Column('decimal', { precision: 6, scale: 2, default: 0 })
  speed!: number;

  @Column('decimal', { precision: 5, scale: 2, default: 100 })
  fuelLevel!: number;

  @Column({ default: true })
  engineStatus!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}

