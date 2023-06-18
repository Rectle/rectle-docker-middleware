import axios from "axios";
import io from "socket.io-client"

const SECRET = await axios.get("http://localhost:8080").then(({ data }) => data.secret)

console.log(SECRET)

const socket = io("ws://localhost:3000/private", {
  reconnectionDelayMax: 10000,
  extraHeaders: {
    'X-Build': 2,
    'X-Token': SECRET
  }
});

socket.emit("build:start")

let i = 0
setInterval(() => {
  socket.emit("build:log", "Testowa wiadomosc" + i)
  i++
}, 30000)

socket.on("connect_error", err => {
    console.log(err)
})

socket.on("logs:all", data => {
    console.log("logs:all ", data)
})