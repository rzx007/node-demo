import { exec } from 'node:child_process';
import { promisify } from 'node:util';
// 与spawn一样开启一个子进程来执行其他的程序, 适用于只需要返回运行状态的情况，或返回少了数据

// 使用wget下载文件的函数
const exec_async = promisify(exec);
export const downloadFileWget = async (file_url: string) => {
  const url = new URL(file_url);
  // 提取文件名
  const file_name = url.pathname.split('/').pop();
  // 组合wget命令
  const wget = 'git clone' + ' ' + file_url;
  // 使用exec执行wget命令

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { stdout, stderr } = await exec_async(wget);
  console.log(stdout);
  console.log(file_name + ' downloaded to ' + '/');
};
downloadFileWget('http://10.172.246.235/low-code/low-code-plantform.git');
