'use strict'
const RockonPlayer = require('../models/rockonplayer.js')

const players = {}

module.exports = (io, socket) => {
  let player

  socket.on('disconnect', () => {
    delete players[socket.id]
    player = undefined
  })

  // When the client selects rockon, he is subscribed to the rockon room
  socket.on('rockon:join', data => {
    socket.join('rockon')
    player = RockonPlayer(socket.id, data.instrument)
    // reply with list of players
    socket.emit('rockon:join', {
      players: Object.values(players),
      you: socket.id
    })
    // notify room that `player` joined
    io.emit('rockon:player_join', {
      player
    })
    // put `player` in list of `players`
    players[socket.id] = player
  })

// When the client selects leave option, unsubscribe him to the rockon room
  socket.on('rockon:leave', data => {
    socket.leave('rockon')
    delete players[socket.id]
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
