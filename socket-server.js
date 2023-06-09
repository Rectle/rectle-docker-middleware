import { Server } from "socket.io";
import localtunnel from "localtunnel";
import { v4 as uuidv4 } from 'uuid';

import publicNamespace from "./namespaces/public.js"
import privateNamespace from "./namespaces/private.js"

const io = new Server(3000, { 
    cors: {
        origin: ["app.rectle.com", "localhost", "127.0.0.1", "::1"],
        allowedHeaders: ["x-build", "x-token"],
        credentials: true
    },
    
 });

publicNamespace.run(io)
privateNamespace.run(io)

// const tunnel = await localtunnel({ 
//     port: 3000,
//     subdomain: `rectle-${uuidv4()}`
// });

// const URL = tunnel.url.replace("https://", `wss://`)

// console.log(URL)
// tunnel.on('close', () => {
//     // tunnels are closed
// });