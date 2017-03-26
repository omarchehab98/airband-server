'use strict'
const assert = require('chai').assert
describe('Track', function () {
  const Track = require('../../src/models/track.js')
  describe('#getMostRepeated', function () {
    it('returns the most repeated number', function () {
      let result
      result = Track.getMostRepeated([3, 2, 3, 3, 5, 6])
      assert.equal(result, 3)
      result = Track.getMostRepeated([4, 4])
      assert.equal(result, 4)
      result = Track.getMostRepeated([1])
      assert.equal(result, 1)
    })

    it('returns a random number of the most repeated numbers', function () {
      let outputs
      let result
      let i
      outputs = []
      for (i = 0; i < 32; i++) {
        result = Track.getMostRepeated([1, 2])
        if (!outputs.some(num => num === result)) {
          outputs.push(result)
        }
      }
      assert.equal(outputs.length, 2)
      outputs = []
      for (i = 0; i < 64; i++) {
        result = Track.getMostRepeated([1, 2, 4, 4, 5, 5])
        if (!outputs.some(num => num === result)) {
          outputs.push(result)
        }
      }
      assert.equal(outputs.length, 2)
    })

    it('returns -1 if empty', function () {
      const result = Track.getMostRepeated([])
      assert.equal(result, -1)
    })
  })

  describe('#binarySearch', function () {
    it('returns the index closest to the offset', function () {
      let track = Track({
        notes: [
          { offset: 0 },
          { offset: 5 },
          { offset: 10 },
          { offset: 15 },
          { offset: 20 },
          { offset: 25 }
        ]
      })
      assert.equal(track.binarySearch(3), 0)
      assert.equal(track.binarySearch(7), 1)
      assert.equal(track.binarySearch(9), 1)
      assert.equal(track.binarySearch(10), 2)
      assert.equal(track.binarySearch(11), 3)
      assert.equal(track.binarySearch(14), 3)
      assert.equal(track.binarySearch(15), 3)
      assert.equal(track.binarySearch(16), 3)
      assert.equal(track.binarySearch(19), 3)
    })
  })

  describe('#getNotesInRange', function () {
    it('returns the notes around an index within an offset range', function () {
      let track = Track({
        notes: [
          { offset: 0 },
          { offset: 5 },
          { offset: 10 },
          { offset: 15 },
          { offset: 20 },
          { offset: 25 },
          { offset: 30 }
        ]
      })
      let index, range, offset, result
      // from middle of array
      index = 3
      range = 5
      offset = 15
      result = track.notes.slice(2, 5)
      assert.deepEqual(track.getNotesInRange(index, range, offset), result)
      // start of array limit
      index = 0
      range = 14
      offset = 0
      result = track.notes.slice(0, 3)
      assert.deepEqual(track.getNotesInRange(index, range, offset), result)
      // end of array limit
      index = 6
      range = 5
      offset = 30
      result = track.notes.slice(5, 7)
      assert.deepEqual(track.getNotesInRange(index, range, offset), result)
    })
  })

  describe('#calculateScore', function () {
    it('calculates score correctly based on when a note is played', function () {
      let track = Track({
        notes: [
          { note_id: 1, is_pressed: true, offset: 0 },
          { note_id: 2, is_pressed: true, offset: 300 },
          { note_id: 3, is_pressed: true, offset: 500 },
          { note_id: 1, is_pressed: true, offset: 800 },
          { note_id: 2, is_pressed: true, offset: 1500 },
          { note_id: 3, is_pressed: true, offset: 2000 },
          { note_id: 1, is_pressed: true, offset: 2500 }
        ]
      })
      let noteId, isPressed, offset, result
      // Perfect note
      noteId = 1
      isPressed = true
      offset = 780
      result = 60
      assert.equal(track.calculateScore(noteId, isPressed, offset), result)
      // Good note
      noteId = 1
      isPressed = true
      offset = 720
      result = 40
      assert.equal(track.calculateScore(noteId, isPressed, offset), result)
      // Fair note
      noteId = 1
      isPressed = true
      offset = 620
      result = 20
      assert.equal(track.calculateScore(noteId, isPressed, offset), result)
      // Wrong note
      noteId = 0
      isPressed = true
      offset = 780
      result = -10
      assert.equal(track.calculateScore(noteId, isPressed, offset), result)
    })
  })
})
