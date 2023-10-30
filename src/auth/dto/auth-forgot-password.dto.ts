import { IsEmail } from "class-validator";

export class AuthForgotPasswordDTO {
  @IsEmail()
  email: string;
}

// Dto's são objetos que definem a estrutura de dados que será enviada ou recebida em uma requisição.
// São parecidos com as interfaces, mas possuem algumas funcionalidades a mais.
// O decorator @IsEmail é usado para validar se o email é válido.