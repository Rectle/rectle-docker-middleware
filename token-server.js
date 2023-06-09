import http from "http"
import { v4 as uuidv4 } from 'uuid'
import sha256 from 'crypto-js/sha256.js';

const SECRET = sha256(uuidv4()).toString()

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.write(JSON.stringify({
    secret: SECRET
  }));
  res.end();
}).listen(8080)