const RockonPlayer = require('../models/rockon.js')
const players = {}
module.exports = (io, socket) => {
  let player

  // When the client selects rockon, he is subscribed to the rockon room
  socket.on('rockon:join', data => {
    socket.join('rockon')
    player = RockonPlayer(socket.id, data.instrument)
    players[socket.id] = player
    console.log(data.instrument)
  })

// When the client selects leave option, unsubscribe him to the rockon room
  socket.on('rockon:leave', data => {
    socket.leave('rockon')
    players[socket.id] = undefined
    player = undefined
  })
// when the client hits a note, the sound of the note, player who hit it and if its pressed is broadcasted to the whole room
  socket.on('rockon:note', data => {
    io.emit('rockon:note', {
      player_id: socket.id,
      note_id: data.note_id,
      is_pressed: data.is_pressed
    })
  })
// When the client finishes recording the song, the recording is broadcasted
  socket.on('rockon:track', data => {
    io.emit('rockon:track', {
      track: data.track
    })
  })
}
