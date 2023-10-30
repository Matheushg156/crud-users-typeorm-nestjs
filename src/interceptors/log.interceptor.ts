import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const date = Date.now();

    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        console.log(`URL: ${request.url}.`);
        console.log(`METHOD: ${request.method}.`);
        console.log(`Execução levou: ${Date.now() - date} milisegundos.`);
      }),
    );
  }
}

// Interceptors são interceptadores que podem ser usados para interceptar requisições.
// O método intercept recebe o contexto da requisição e o próximo handler.
// O contexto da requisição é obtido através do método switchToHttp.
// O método handle é executado após o interceptor.
// O método tap é executado após o método handle.
// O método tap recebe uma função que é executada após o método handle. 
// A função recebe o valor retornado pelo método handle.
// O método tap é usado para fazer o log da requisição.