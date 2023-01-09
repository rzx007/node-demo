// vfile是一种小型且浏览器友好的虚拟文件格式，用于跟踪元数据（例如文件的path和value)
import { VFile } from 'vfile';

// 创建一个虚拟文件
const file = new VFile({
  path: './example.txt',
  value: 'Alpha *braavo* charlie.',
});

console.log(file.path); // ./example.txt
console.log(file.dirname); // .

file.extname = '.md';
console.log(file.basename); // example.md

file.basename = 'index.txt';

console.log(file.history); // [ './example.txt', 'example.md', 'index.txt' ]

file.message('Unexpected unknown word `braavo`, did you mean `bravo`?', {
  line: 1,
  column: 8,
});

console.log(file.messages);
