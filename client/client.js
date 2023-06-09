import axios from "axios";
import io from "socket.io-client"

const SECRET = await axios.get("http://localhost:8080").then(({ data }) => data.secret)

console.log(SECRET)

const socket = io("ws://localhost:3000/private", {
  reconnectionDelayMax: 10000,
  extraHeaders: {
    'X-Build': '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
    'X-Token': SECRET
  }
});

socket.emit("build:start")

socket.on("connect_error", err => {
    console.log(err)
})

socket.on("logs:all", data => {
    console.log("logs:all ", data)
})