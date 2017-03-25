const http = require('http')
const socketio = require('socket.io')

const rooms = {
  rockon: require('./rooms/rockon.js'),
  challenge: require('./rooms/challenge.js')
}

const app = http.createServer().listen(80, '0.0.0.0')
const io = socketio.listen(app)

const tracks = require('./tracks.json')

io.on('connection', socket => {
  socket.emit('init', {
    tracks
  })

  rooms.rockon(io.to('rockon'), socket)

  rooms.challenge(io.to('challenge'), socket, tracks)
})
