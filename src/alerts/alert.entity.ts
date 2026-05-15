import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('alerts')
@Index(['vehicleId', 'createdAt'])
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  vehicleId!: string;

  @Column()
  type!: string;

  @Column()
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

