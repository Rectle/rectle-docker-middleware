import { validate as uuidValidate } from 'uuid';

const getRoom = socket => socket.handshake.headers["x-build"]

const buildValidate = buildId => {
    return uuidValidate(buildId) || (!Number.isNaN(buildId) && Number.isSafeInteger(parseInt(buildId)))
}

export {
    buildValidate,
    getRoom
}