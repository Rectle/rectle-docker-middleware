import axios from "axios";
import io from "socket.io-client"

const SECRET = '55694a8c643c88d3b1a9be8cfbef1e0d501777334cfaa4c3654c65b503eacc9b'
// const SECRET = await axios.get("http://localhost:8080").then(({ data }) => data.secret)


console.log(SECRET)

const socket = io("wss://rectle-800d0326-9485-4ccd-a28e-39ff0973ba21.loca.lt/private", {
  reconnectionDelayMax: 10000,
  extraHeaders: {
    'X-Build': 99999,
    'X-Token': SECRET,
    'bypass-tunnel-reminder': 'rectle'
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