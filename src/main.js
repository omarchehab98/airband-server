const fs = require('fs')
const path = require('path')
const app = require('http').createServer((req, res) => {
  fs.readFile(path.join(__dirname, '/../spec/fixtures/mock.html'),
  function (err, data) {
    if (err) {
      res.writeHead(500)
      return res.end('Error loading mock.html')
    }

    res.writeHead(200)
    res.end(data)
  })
})
const io = require('socket.io')(app)
app.listen(80, '0.0.0.0')

const rooms = {
  rockon: require('./rooms/rockon.js'),
  challenge: require('./rooms/challenge.js')
}

const tracks = require('./tracks.json')

io.on('connection', socket => {
  console.log('connection', socket.id)

  socket.emit('init', {
    tracks
  })
  rooms.rockon(io.to('rockon'), socket)
  rooms.challenge(io.to('challenge'), socket, tracks)
  socket.on('new_track', data => {
    // when the client finishes recording a track
    // append it to the list of tracks
    tracks.push(data.track)
    // notify everyone
    io.emit('new_track', {
      track: data.track
    })
    fs.writeFile('tracks.json', JSON.stringify(tracks))
  })

  socket.on('disconnect', () => {
    console.log('disconnect', socket.id)
  })
})
