import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    const token = (authorization ?? '').split(' ')[1];

    try {
      const data = this.authService.checkToken(token);

      const user = await this.userService.readOne(data.id);

      request.tokenPayload = data;

      request.user = user;

      return true;
    } catch (error) {
      return false;
    }
  }
}

// Guards são interceptadores que podem ser usados para proteger rotas.
// O método canActivate recebe o contexto da requisição e retorna um booleano.
// O contexto da requisição é obtido através do método switchToHttp.
// O token é obtido através do header Authorization.
// O token é verificado através do método checkToken do AuthService.
// O usuário é obtido através do método readOne do UserService.
// O usuário e o token são adicionados na requisição.