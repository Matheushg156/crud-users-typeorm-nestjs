import { ExecutionContext, NotFoundException, createParamDecorator } from "@nestjs/common";

export const User = createParamDecorator((filter: string, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  if (!request.user) {
    throw new NotFoundException('User not found in request');
  }

  if (filter) {
    return request.user[filter];
  }

  return request.user;
})

// Podemos criar um decorator para injetar o usuário logado na requisição. 
// Decorators personalizados são criados com a função createParamDecorator do NestJS.
// O primeiro parâmetro é o filtro, que é opcional.
// O segundo parâmetro é o contexto da requisição.
// O decorator retorna o usuário logado na requisição.
