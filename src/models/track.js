'use strict'
const Track = function (track) {
  const _track = Object.assign({
    /**
     * Returns a numerical judgement judging based on how far off a
     * note is from the track's notes
     * @param {number} noteId what note is played
     * @param {boolean} isPressed whether or not the note is pressed
     * @param {number} offset what time is the note played
     * @returns {number} score
     */
    calculateScore: function (noteId, isPressed, offset) {
      const index = _track.binarySearch(offset)
      const notes = _track.getNotesInRange(index, 100, offset)
    },
    /**
     * Performs a slightly modified binary search
     * It returns the index of the note with the offset closest
     * to the given `offset`
     * @param {number} offset Note offset
     */
    binarySearch: function (offset) {
      let low = 0
      let high = _track.notes.length - 1
      let mid
      while (high - low > 0) {
        mid = Math.floor((high + low) / 2)
        let noteOffset = _track.notes[mid].offset
        if (offset > noteOffset) {
          low = mid + 1
        } else if (offset < noteOffset) {
          high = mid
        } else {
          break
        }
      }
      return mid
    },
    /**
     * Returns an array of all the notes in a certain `offset` `range` around
     * the index `index`.
     * @param {number} index start index in the array to flood fill from
     * @param {number} range absolute offset threshold
     * @param {number} offset target offset
     * @return {number[]}
     */
    getNotesInRange: function (index, range, offset) {
      const notes = _track.notes
      const result = []
      let i = index
      while (i >= 0 && Math.abs(notes[i].offset - offset) <= range) {
        result.unshift(notes[i])
        i -= 1
      }
      i = index + 1
      while (i < notes.length && Math.abs(notes[i].offset - offset) <= range) {
        result.push(notes[i])
        i += 1
      }
      return result
    }
  }, track)
  return _track
}

/**
 * Returns the most repeated element in an array
 * If there is a tie, then it chooses randomly
 * If the arr is empty or contains only -1's, -1 will be returned
 * @param {number[]} arr positive integers
 * @return {number} most repeated number or -1
 */
Track.getMostRepeated = function (arr) {
  let result
  // Reduce to an object where the keys are the integers and values are the
  // number of times that integer is repeated
  let maxValue = -1
  const repetitionMap = arr.reduce(
    (obj, val) => {
      // increment by 1 or set to 1 if it does not exist
      obj[val] = obj[val] ? obj[val] + 1 : 1
      if (obj[val] > maxValue) {
        maxValue = obj[val]
      }
      return obj
    },
    {}
  )
  // if there are integers in the list with a value greater than -1
  if (maxValue > -1) {
    const mostRepeated = []
    // put all the most repeated integers in an array
    for (let key in repetitionMap) {
      if (repetitionMap[key] === maxValue) {
        mostRepeated.push(key)
      }
    }
    // choose a random integer from the integers that have been repeated the
    // most
    const randomIndex = Math.floor(Math.random() * mostRepeated.length)
    result = mostRepeated[randomIndex]
  } else {
    result = -1
  }
  return result
}

module.exports = Track
