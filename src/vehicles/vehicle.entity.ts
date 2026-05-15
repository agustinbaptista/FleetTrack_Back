import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  plate!: string;

  @Column()
  model!: string;

  @Column()
  driverName!: string;

  @Column({ default: 'offline' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

