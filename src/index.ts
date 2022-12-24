
import cluster from 'node:cluster';
import { cpus } from 'node:os'
import process from 'node:process'
import http from 'node:http';

const numCpus = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running!`);
  for (let index = 0; index < numCpus; index++) {
    cluster.fork()
  }
  cluster.on('fork', (worker) => {
    console.log(`worker ${worker.process.pid}`);
  })
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
 const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end(` hello world!\n ${JSON.stringify(req.url)}`);
  }).listen(8000)
  server.addListener('listening', ()=> {
    console.log(server.address()); 
  })
  console.log(`Worker ${process.pid} started`);
}