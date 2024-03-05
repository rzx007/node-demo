// koa洋葱模型简单实现

type Middleware = (ctx: any, next: () => Promise<any>) => Promise<void>;

export default class KoaUnion {
  private middlewares: Array<Middleware> = [];

  public use(fn: Middleware) {
    this.middlewares.push(fn);
  }

  public compose(middlewares: Array<Middleware>) {
    return function (ctx: any) {
      return dispatch(0);
      function dispatch(i: number): Promise<void> {
        const fn = middlewares[i];

        // 为了支持异步方法,所以需要返回Promise.resolve()
        if (!fn) {
          return Promise.resolve();
        }

        return Promise.resolve(
          fn(ctx, function next() {
            return dispatch(i + 1);
          }),
        );
      }
    };
  }

  public start() {
    const ctx = {};
    const fn = this.compose(this.middlewares);
    fn(ctx);
  }
}

const app = new KoaUnion();
// 使用方法
app.use(async (ctx, next) => {
  console.log('fn1 begin');
  await next();
  console.log('fn1 end');
});
app.use(async (ctx, next) => {
  console.log('fn2 begin');
  await delay();
  await next();
  console.log('fn2 end');
});
app.use(async (ctx, next) => {
  console.log('fn3 end');
});

// 模拟异步方法
function delay() {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

app.start();
