// 定义class类型
export interface Type<T> extends Function {
  new (...args: any[]): T;
}
