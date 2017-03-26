'use strict'
const ChallengePlayer = require('../models/challengeplayer.js')
const Track = require('../models/track.js')

const players = {}

module.exports = (io, socket, tracks) => {
  let player
  let track
  let startTime

  socket.on('challenge:join', data => {
    // subscribe `socket` to the 'challenge' room
    socket.join('challenge')
    // create a new player and add to the list of players
    player = ChallengePlayer(socket.id)
    // reply with list of players
    socket.emit('challenge:join', {
      players: Object.values(players),
      you: socket.id
    })
    // notify room that `player` joined
    io.emit('challenge:player_join', {
      player
    })
    // put `player` in list of `players`
    players[socket.id] = player
  })

  socket.on('challenge:ready', data => {
    // update `player`'s state
    player.is_ready = data.is_ready
    player.track_id = data.track_id
    // notify room that `player` updated their state
    io.emit('challenge:ready', {
      player_id: player.id,
      is_ready: data.is_ready,
      track_id: data.track_id
    })
    onReady()
  })

  function onReady () {
    // `_players` is an array the players
    const _players = Object.values(players)
    // `allReady` whether all players are ready or not
    const allReady = _players.every(player => player.is_ready)
    if (allReady) {
      // `trackIds` is an array of the track_id's that have been selected
      // may contain -1 indicating unselected
      const trackIds = _players.map(player => player.track_id)
      // select a single track from the the chosen tracks
      let trackId = Track.getMostRepeated(trackIds)
      // if there was no chosen tracks, select a random track
      if (trackId === -1) {
        const randomTrack = Math.floor(Math.random() * tracks.length)
        trackId = tracks[randomTrack].id
      }
      // start the game with that track
      onStart(trackId)
    }
  }

  function onStart (trackId) {
    io.emit('challenge:start', {
      track_id: trackId
    })
    track = Track(track)
    startTime = Date.now()
    const endTime = Date.now() + track.duration
    setTimeout(onEnd, endTime)
  }

  socket.on('challenge:note', data => {
    const offset = Date.now() - startTime
    const score = track.calculateScore(data.note_id, data.is_pressed, offset)
    player.score += score
    console.log(player.score)
    io.emit('challenge:note', {
      player_id: player.id,
      score: score,
      note_id: data.note_id,
      is_pressed: data.is_pressed
    })
  })

  function onEnd () {
    const _players = Object.values(players).sort((p1, p2) => {
      return p2.score - p1.score
    })
    io.emit('challenge:end', {
      players: _players
    })
    _players.forEach(player => {
      io.sockets.connected[player.id].leave('challenge')
    })
  }
}
