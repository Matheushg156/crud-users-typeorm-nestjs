import { Role } from 'src/enums/role.enum';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'users'
})
export class UserEntity {

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
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
  birthAt: Date;

  @Column({
    default: Role.User
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