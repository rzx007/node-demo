function getUser() {
  return fetch('https://my-json-server.typicode.com/typicode/demo/profile');
}

function m1() {
  //other  works
  return getUser();
}

function m2() {
  //other  works
  return m1();
}

function m3() {
  //other  works
  return m2();
}

function main() {
  const res = m3();
  console.log('res', res);
}

function run(func) {
  const cache = []; //缓存的列表
  let i = 0; //缓存下标
  const _originalFetch = window.fetch; //储存原先的fetch
  window.fetch = (...args) => {
    //重写fetch函数
    if (cache[i]) {
      if (cache[i].status === 'fulfilled') {
        return cache[i].data;
      } else if (cache[i].status === 'rejected') {
        throw cache[i].err;
      }
    }
    const result = {
      status: 'pending',
      data: null,
      err: null,
    };
    cache[i++] = result;
    //发送请求
    const prom = _originalFetch(...args)
      .then((resp) => resp.json())
      .then(
        (resp) => {
          result.status = 'fulfilled';
          result.data = resp;
        },
        (err) => {
          result.status = 'rejected';
          result.data = err;
        },
      );
    throw prom;
  };
  try {
    func();
  } catch (err) {
    //什么时候引发重新执行function
    if (err instanceof Promise) {
      const reRun = () => {
        i = 0;
        func();
      };
      err.then(reRun, reRun);
    }
  }
}
run(main);
