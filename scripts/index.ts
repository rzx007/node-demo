import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { argv } from 'node:process';

const exec_async = promisify(exec);
async function main() {
  const params = argv.slice(2);
  const { stdout, stderr } = await exec_async(`pnpm dlx tsx ${params[0]}`);
  console.log(`运行结果: ${stdout}`);
  // console.error(`stderr: ${stderr}`);
}
main();
