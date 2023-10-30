import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    if (isNaN(Number(req.params.id)) || Number(req.params.id) <= 0) {
      throw new BadRequestException('Id must be a number.');
    }

    next();
  }
}

// Middlewares são interceptadores que podem ser usados para interceptar requisições.
// O método use recebe a requisição, a resposta e o próximo middleware.
// O método use é executado antes do método handle.
