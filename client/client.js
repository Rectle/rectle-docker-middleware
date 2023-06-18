import axios from "axios";
import io from "socket.io-client"

const socket = io("ws://localhost:3000/", {
  reconnectionDelayMax: 10000,
  extraHeaders: {
    'X-Build': 14
  }
});

socket.emit("build:join")

socket.on("build:logs", logs => {
  console.log(logs)
})

socket.on("build:log", logs => {
  console.log(logs)
})

socket.on("connect_error", err => {
    console.log(err)
})

socket.on("logs:all", data => {
    console.log("logs:all ", data)
})