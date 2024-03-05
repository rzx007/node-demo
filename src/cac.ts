/**
 * cac用于构建 CLI 应用程序的 JavaScript 库
 */
// examples/basic-usage.js
import { cac } from 'cac'
const cli = cac();

cli
.command('cerate <name>', 'create a project')
.option('--type <type>', 'Choose a project type node react vue', {
  default: 'node',
})
.action((name, options) => {
  console.log(`project ${name} has been created, type is ${options.type}`)
});

cli.help()

const parsed = cli.parse();

console.log(JSON.stringify(parsed, null, 2));
