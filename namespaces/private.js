import axios from "axios"
import { validate as uuidValidate } from 'uuid';
import store from "../store/index.js"

const getRoom = socket => socket.handshake.headers["x-build"]

const run = async (io) => {
    console.info("Secret namespace starting...")
    const { secret: SECRET } = await axios.get("http://localhost:8080/").then(res => res.data)
    const nsp = io.of("/private")

    nsp.on("connection", (socket, next) => {
        socket.use((event, next) => {
            if (socket.handshake.headers["x-token"] !== SECRET) {
                const err = Error("Access denied")
                err.data = "Invalid or missing token."
                next(err)
            }
    
            if  (!uuidValidate(getRoom(socket))) {
                const err = Error("Access denied")
                err.data = "Invalid or missing build id."
                next(err)
            }
    
            next()
        })
        
        socket.on("build:start", () => {
            const room = getRoom(socket)

            socket.join(room)
            store.builds[room] = { logs: [] }

            console.log(room, socket)
        })

        socket.on("build:log", log => {
            const room = getRoom(socket)
            store.builds[room]?.logs?.push(log)
        })

        socket.on("build:finish", () => {
            const room = getRoom(socket)

            socket.leave(room)
            delete store.builds[room]
        })

        socket.on("disconnect", reason => {
            console.info("Disconnected:", reason)
        })

        socket.on("error", error => {
            console.error(error)
            socket.disconnect()
        })
    })


}

export default {
    run
}