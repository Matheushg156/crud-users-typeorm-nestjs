import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor() {}

  async userExists(id: number) {
    if (!(await this.prisma.user.count({ where: { id } }))) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }
  }

  async create({ name, email, password, birthAt }: CreateUserDTO) {

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);

    return await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
      },
    });
  }

  async read() {
    return await this.prisma.user.findMany();
  }

  async readOne(id: number) {
    await this.userExists(id);

    return await this.prisma.user.findUnique({
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

    return await this.prisma.user.update({
      data: {
        name,
        email,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
        role
      },
      where: { id },
    });
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

    return await this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async delete(id: number) {
    await this.userExists(id);

    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
