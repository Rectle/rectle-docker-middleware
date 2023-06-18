import store from "../store/index.js"
import { buildValidate, getRoom } from "./helpers/build.js"

const run = (io) => {
    console.info("Public namespace starting...")
    const nsp = io.of("/")

    nsp.on("connection", socket => {
        socket.use((event, next) => {
            const room = getRoom(socket)

            if (!buildValidate(room)) {
                const err = Error("Access denied")
                err.data = "Invalid or missing build id."
                next(err)
            }
    
            next()
        })
        
        socket.on("build:join", () => {
            const room = getRoom(socket)

            socket.join(room)

            socket.emit("build:logs", store.builds?.[room]?.logs)
        })

    })
}

export default {
    run
}