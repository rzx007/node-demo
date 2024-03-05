import { readFile, accessSync, constants } from 'fs';
import { createServer } from 'http';
import { consola } from 'consola';
import { join, normalize, resolve, extname } from 'path';

const port = 9000;
const directoryName = '../public';

// Maps file extention to MIME types
// 完整的 MIME 类型列表: https://www.freeformatter.com/mime-types-list.html
const types = {
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  json: 'application/json',
  xml: 'application/xml',
};

const root = normalize(resolve(directoryName));

const server = createServer((req, res) => {
  consola.log(`${req.method} ${req.url}`);

  const extension = extname(req.url).slice(1);
  const type = extension ? types[extension] : types.html;
  const supportedExtension = Boolean(type);

  // 不支持的文件类型
  if (!supportedExtension) {
    console.error(`404: ${req.url} is not a supported file extension`);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404: File not found');
    return;
  }

  let fileName = req.url;
  // 首页
  if (req.url === '/') fileName = 'index.html';
  else if (!extension) {
    // 访问路径没有后缀，尝试添加.html后缀,文件存不存在，否则首页
    try {
      accessSync(join(root, req.url + '.html'), constants.F_OK);
      fileName = req.url + '.html';
    } catch (e) {
      fileName = join(req.url, 'index.html');
    }
  }

  // 检查访问的文件是否在root目录之下, 防止访问到其他目录
  const filePath = join(root, fileName);
  const isPathUnderRoot = normalize(resolve(filePath)).startsWith(root);

  if (!isPathUnderRoot) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404: File not found');
    return;
  }

  readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404: File not found');
    } else {
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
