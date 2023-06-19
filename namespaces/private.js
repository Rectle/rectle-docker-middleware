import axios from "axios"
import axiosRetry from 'axios-retry'

import store from "../store/index.js"
import { getRoom, buildValidate } from "./helpers/build.js"

axiosRetry(axios, { retries: 3 })

// TODO: Move to env
const SERVER_URL = 'https://rectle-service-wxvnwxzk5a-lm.a.run.app/api/v1/compilations'
const TOKEN = 'TOKEN_HERE'

const run = async (io, runnerUrl) => {
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
    
            const room = getRoom(socket)

            if (!buildValidate(room)) {
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

            axios.put(`${SERVER_URL}/${room}/runner`, {
                url: runnerUrl
            }, {
                headers: {
                    'X-Authorization': TOKEN
                }
            }).catch(err => console.error(err))
        })

        socket.on("build:log", log => {
            const room = getRoom(socket)

            store.builds[room]?.logs?.push(log)

            io.of("/").to(room).emit("build:log", log)
        })

        socket.on("build:finish", () => {
            const room = getRoom(socket)

            socket.leave(room)
            
            axios.put(`${SERVER_URL}/${room}/logs`, {
                logs: store.builds[room].logs
            }, {
                headers: {
                    'X-Authorization': TOKEN
                }
            }).catch(err => console.error(err))

            delete store.builds[room]
            io.of("/").to(room).emit("build:finish")
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