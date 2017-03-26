module.exports = function (id) {
  const player = {
    id,
    is_ready: false,
    track_id: -1,
    score: 0
  }
  return player
}
