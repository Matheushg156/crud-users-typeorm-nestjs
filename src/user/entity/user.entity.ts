import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class UserEntity {

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })

  @Column()
  id: number;

  @Column({
    length: 255
  })
  name: string;

  @Column({
    length: 255,
    unique: true
  })
  email: string;

  @Column({
    length: 255
  })
  password: string;

  @Column({
    type: 'date',
    nullable: true
  })
  birthAt: string;

  @Column({
    enum: [1, 2],
  })
  role: number;

  @CreateDateColumn({
    type: 'datetime',
    name: 'created_at'
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'datetime',
    name: 'updated_at'
  })
  updatedAt: string;
}