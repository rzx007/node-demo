export interface NestInterceptor {
  intercept(): any;

  canActive(...params: any[]): void;
}

class ResInterceptor implements NestInterceptor {
  intercept() {
    console.log(1);
  }
  canActive(...params: any[]) {
    console.log(params);
  }
  aa() {
    console.log('myself method');
  }
}

const interceptor = new ResInterceptor();
interceptor.canActive(1, '123');
