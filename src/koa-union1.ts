// 函数组合
function compose(middleWares) {
  return function () {
    return dispatch(0);
    function dispatch(i) {
      const fn = middleWares[i];
      // 为了支持异步方法,所以需要返回Promise.resolve()
      if (!fn) {
        return Promise.resolve();
      }
      return Promise.resolve(
        fn(function next() {
          return dispatch(i + 1);
        }),
      );
    }
  };
}

async function fn1(next) {
  console.log('fn1 begin');
  await next();
  console.log('fn1 end');
}
async function fn2(next) {
  console.log('fn2 begin');
  await delay();
  await next();
  console.log('fn2 end');
}
function fn3(next) {
  console.log('fn3');
}

// 模拟异步方法
function delay() {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

const middleWares = [fn1, fn2, fn3];
const finalFn = compose(middleWares);
finalFn();
