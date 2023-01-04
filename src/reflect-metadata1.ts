import 'reflect-metadata';
function Path(p1: string, p2: string) {
  return function (target: any) {
    //  这才是真正装饰器
    console.log(target, p1, p2);
    Reflect.defineMetadata('Path', p1, target);
  };
}
function Method(name: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    console.log('args ' + name);
    console.log(target);
    console.log('prop ' + propertyKey);
    console.log('desc ' + JSON.stringify(descriptor) + '\n\n');
    // descriptor.value为当前被装饰的方法
    console.log(descriptor.value());
  };
}

@Path('/hello', 'world')
class HelloService {
  @Method('shifu')
  hello() {
    return 'instance method';
  }
}

new HelloService();

const matedata = Reflect.getMetadata('Path', HelloService);
console.log(matedata);
