import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const requiriedRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiriedRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;
    
    const roleFilter = requiriedRoles.filter(role => role === user.role);

    return roleFilter.length > 0;
  }
}

// Para acessar os decorators personalizados, usamos o método get do Reflector.
// O Reflector é responsável por acessar os metadados de uma classe, como os decorators.
// O método get do Reflector recebe dois parâmetros:
// - a chave dos metadados, que é o nome do decorator
// - o contexto, que é o contexto da requisição, que é o ExecutionContext que o método canActivate() recebe como parâmetro
// O método get do Reflector retorna um array com os metadados que definimos no decorator.