import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { TaskEntity } from './task.entity'; 

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; 

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks: TaskEntity[];
}