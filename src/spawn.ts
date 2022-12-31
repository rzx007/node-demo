import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';
// 开启一个子进程来执行其他的程序, 适用于需要子进程返回大量数据的情况

// 使用curl下载文件的函数
export const downloadFileCurl = function (file_url: string) {
  const url = new URL(file_url);
  // 提取文件名
  const file_name = url.pathname.split('/').pop();
  // 创建一个可写流的实例
  const file = createWriteStream('/' + file_name);
  // 使用spawn运行curl
  const curl = spawn('curl', [file_url]);
  // 为spawn实例添加了一个data事件
  curl.stdout.on('data', function (data) {
    file.write(data);
  });
  // 添加一个end监听器来关闭文件流
  curl.stdout.on('end', function () {
    file.end();
    console.log(file_name + ' downloaded to ' + '/');
  });
  // 当子进程退出时，检查是否有错误，同时关闭文件流
  curl.on('exit', function (code) {
    if (code != 0) {
      console.log('Failed: ' + code);
    }
  });
};

// 参考资料： https://blog.csdn.net/mawubin525/article/details/51603658
