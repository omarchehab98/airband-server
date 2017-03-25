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
      assert.equal(track.binarySearch(14), 2)
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
      const index = 3
      const range = 5
      const offset = 15
      const result = track.notes.slice(2, 5)
      assert.deepEqual(track.getNotesInRange(index, range, offset), result)
    })
  })
})
