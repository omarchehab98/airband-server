const fs = require('fs')
const app = require('http').createServer((req, res) => {
  fs.readFile(__dirname + '/../spec/fixtures/mock.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading mock.html');
    }

    res.writeHead(200);
    res.end(data);
  });
})
const io = require('socket.io')(app)
app.listen(80, '0.0.0.0')

const rooms = {
  rockon: require('./rooms/rockon.js'),
  challenge: require('./rooms/challenge.js')
}

const tracks = require('./tracks.json')

console.log('Started')
io.on('connection', socket => {
  console.log('connection', socket.id)

  socket.emit('init', {
    tracks
  })
  rooms.rockon(io.to('rockon'), socket)
  rooms.challenge(io.to('challenge'), socket, tracks)

  socket.on('disconnect', () => {
    console.log('disconnect', socket.id)
  })
})
