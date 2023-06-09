import { validate as uuidValidate } from 'uuid';

const getRoom = socket => socket.handshake.headers["x-build"]

const run = (io) => {
    console.info("Public namespace starting...")
    const nsp = io.of("/")

    nsp.on("connection", socket => {
        socket.use((event, next) => {
            if  (!uuidValidate(getRoom(socket))) {
                const err = Error("Access denied")
                err.data = "Invalid or missing build id."
                next(err)
            }
    
            next()
        })
    })
}

export default {
    run
}