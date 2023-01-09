import 'reflect-metadata';

// 定义Controller
const Controller = (path: string): ClassDecorator => {
  return (target: any) => {
    Reflect.defineMetadata('path', path, target);
  };
};
// 定义 Get, Post等请求方法装饰器
const createMappingDecorator = (method: string) => {
  return (path: string): MethodDecorator =>
    (target: any, key: any, descriptor: any) => {
      console.log(descriptor);
      Reflect.defineMetadata('path', path, target, key);
      Reflect.defineMetadata('method', method, target, key);
    };
};

const Get = createMappingDecorator('GET');
const Post = createMappingDecorator('POST');

// -------------------------华丽的分割线-------------------------

// 创建收集函数
function isFunction(arg: any): boolean {
  return typeof arg === 'function';
}

function isConstructor(arg: string) {
  return arg === 'constructor';
}

type Constructor<T = any> = new (...args: any[]) => T;
const collectRoute = (instance) => {
  const prototype = Object.getPrototypeOf(instance);
  // 筛选出对象的方法
  const methods = Object.getOwnPropertyNames(prototype).filter(
    (item) => !isConstructor(item) && isFunction(prototype[item]),
  );
  return methods.map((methodName) => {
    const fn = prototype[methodName];
    // 获取方法上的元数据
    const route = Reflect.getMetadata('path', instance, methodName);
    const reqMethod = Reflect.getMetadata('method', instance, methodName);
    return {
      route,
      method: reqMethod,
      fn,
      methodName,
    };
  });
};

// -------------------------华丽的分割线-------------------------

// 使用案例
@Controller('/test')
class SomeClass {
  @Get('/a')
  someGetMethod() {
    return 'hello world';
  }

  @Post('/b')
  somePostMethod() {
    return 'post value';
  }
}

// -------------------------华丽的分割线-------------------------

Reflect.getMetadata('method', SomeClass); // '/test'

const routes = collectRoute(new SomeClass());

console.log(routes);

/**
 [
  {
    route: '/a',
    method: 'GET',
    fn: [Function: someGetMethod],
    methodName: 'someGetMethod'
  },
  {
    route: '/b',
    method: 'POST',
    fn: [Function: somePostMethod],
    methodName: 'somePostMethod'
  }
]
*/
