import { Server } from "socket.io";
import localtunnel from "localtunnel";
import { v4 as uuidv4 } from 'uuid';
import http from "http"
import sha256 from 'crypto-js/sha256.js';

import publicNamespace from "./namespaces/public.js"
import privateNamespace from "./namespaces/private.js"

const createSocketServer = async () => {
    const io = new Server(3000, { 
        cors: {
            origin: "*",
            allowedHeaders: ["x-build", "x-token", "bypass-tunnel-reminder"]
        },
        
     });
    
    publicNamespace.run(io)
    privateNamespace.run(io, URL)
}


const tunnel = await localtunnel({ 
    port: 3000,
    subdomain: `rectle-${uuidv4()}`
});

const URL = tunnel.url.replace("https://", `wss://`)

console.log(URL)
tunnel.on('close', () => {
    // tunnels are closed
});


const SECRET = sha256(uuidv4()).toString()

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.write(JSON.stringify({
    secret: SECRET
  }));
  res.end();
}).listen(8080, createSocketServer)