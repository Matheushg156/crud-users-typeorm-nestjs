import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { ParamId } from 'src/decorators/paramId.decoretor';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
// import { LogInterceptor } from '../interceptors/log.interceptor';

// Podemos usar mais de um guard em uma rota, para isso, usamos o decorator @UseGuards() passando um array de guards
// Todas as rotas desse controller vão usar o guard RoleGuard, que é o guard que criamos para validar as roles
// @UseInterceptors(LogInterceptor) possivel usar somente em controller ou global ou por metodo.
@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Usamos o decorator @Roles() para definir as roles que podem acessar a rota, nesse caso somente o admin
  // Para validar as roles, vamos usar um guard, que é um interceptador que vai validar os metadados
  // @Roles(Role.Admin) podemos usar por metodo ou controller ou global.
  @Post()
  async create(@Body() userData: CreateUserDTO) {
    return await this.userService.create(userData);
  }

  @Get()
  async read() {
    return this.userService.read();
  }

  @Get(':id')
  async readOne(@ParamId() id: number) {
    return this.userService.readOne(id);
  }

  @Put(':id')
  async update(@ParamId() id: number, @Body() data: UpdatePutUserDTO) {
    return await this.userService.update(id, data);
  }

  @Patch(':id')
  async updatePartial(@ParamId() id: number, @Body() data: UpdatePatchUserDTO) {
    return await this.userService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@ParamId() id: number) {
    return await this.userService.delete(id);
  }
}
