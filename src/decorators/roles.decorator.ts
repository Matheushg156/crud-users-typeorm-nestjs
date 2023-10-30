import { SetMetadata } from "@nestjs/common";
import { Role } from "src/enums/role.enum";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// Usamos o decorator @SetMetadata() para definir os metadados que serão usados pelo guard
// O decorator @SetMetadata() recebe dois parâmetros:
// - a chave dos metadados, que é o nome do decorator
// - o valor dos metadados, que é um array de roles
// A ideia é criar um decorator que receba um array de roles 
// que vamos usar para definir as roles que podem acessar uma ou mais rotas