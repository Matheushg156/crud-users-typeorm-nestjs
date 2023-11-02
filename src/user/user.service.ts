import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
  ) {}

  async userExists(id: number) {

    const exists: boolean = await this.usersRepository.exist({ where: { id } });

    if (!exists) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }
  }

  async create({ name, email, password, birthAt }: CreateUserDTO) {

    const exists: boolean = await this.usersRepository.exist({ where: { email } });

    if (exists) {
      throw new BadRequestException(`User with email ${email} already exists`);
    }

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);

    const data = {
      name,
      email,
      password,
      birthAt: birthAt ? new Date(birthAt) : null
    }

    const user = this.usersRepository.create(data);

    return await this.usersRepository.save(user);
  }

  async read() {
    return await this.usersRepository.find();
  }

  async readOne(id: number) {
    await this.userExists(id);

    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: number,
    { name, email, password, birthAt, role }: UpdatePutUserDTO,
  ) {
    await this.userExists(id);

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);

    await this.usersRepository.update(id, {
        name,
        email,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
        role
    });

    return await this.readOne(id);
  }

  async updatePartial(
    id: number,
    { name, email, password, birthAt, role }: UpdatePatchUserDTO,
  ) {
    await this.userExists(id);

    const salt = await bcrypt.genSalt();

    const data: any = {};

    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.password = await bcrypt.hash(password, salt);
    if (birthAt) data.birthAt = new Date(birthAt);
    if (role) data.role = role;

    await this.usersRepository.update(id, data);

    return await this.readOne(id);
  }

  async delete(id: number) {
    await this.userExists(id);

    return await this.usersRepository.delete(id);
  }
}
